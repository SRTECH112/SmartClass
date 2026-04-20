import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const SYSTEM_PROMPT = `You are an expert teacher and instructional designer.

Your task is to regenerate a single slide based on the provided context and current slide content.

RULES:
1. Generate EXACTLY ONE slide
2. Improve clarity and pedagogical value
3. Keep the same general topic/focus
4. Use short bullet points (max 8 words each)
5. Ensure content is appropriate for the grade level

OUTPUT FORMAT (JSON only):
{
  "title": "Slide Title Here",
  "layout": "content",
  "bullets": ["Point 1", "Point 2", "Point 3"]
}

IMPORTANT: Return ONLY valid JSON, no explanations, no markdown.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gradeLevel, subject, topic, currentSlide, lessonContext } = body;

    if (!currentSlide) {
      return NextResponse.json(
        { error: 'Current slide data is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error. Please contact administrator.' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const userPrompt = `LESSON CONTEXT:
Grade Level: ${gradeLevel}
Subject: ${subject}
Lesson Topic: ${topic}

CURRENT SLIDE TO REGENERATE:
Title: ${currentSlide.title}
Bullets: ${currentSlide.bullets.join(', ')}

${lessonContext ? `FULL LESSON CONTEXT:\n${lessonContext}\n` : ''}

TASK:
Regenerate this slide with improved clarity and pedagogical value.
- Keep the same general topic/focus
- Improve wording and structure
- Use language appropriate for ${gradeLevel}
- Keep bullet points concise (max 8 words each)

Return ONLY the JSON object for the regenerated slide.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.5,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const responseText = response.choices[0].message.content || '';

    // Parse JSON response
    let slideData;
    try {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        slideData = JSON.parse(jsonMatch[0]);
      } else {
        slideData = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', responseText);
      return NextResponse.json(
        { error: 'Failed to parse regenerated slide. Please try again.' },
        { status: 500 }
      );
    }

    // Validate slide structure
    if (!slideData.title || !Array.isArray(slideData.bullets)) {
      console.error('Invalid slide structure:', slideData);
      return NextResponse.json(
        { error: 'Invalid slide structure returned. Please try again.' },
        { status: 500 }
      );
    }

    // Return regenerated slide
    const regeneratedSlide = {
      title: slideData.title,
      layout: slideData.layout || 'content',
      bullets: slideData.bullets.filter((b: string) => b.trim() !== ''),
    };
    
    return NextResponse.json({ slide: regeneratedSlide });

  } catch (error: any) {
    console.error('Error regenerating slide:', error);
    
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check server configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'An error occurred while regenerating the slide.' },
      { status: 500 }
    );
  }
}

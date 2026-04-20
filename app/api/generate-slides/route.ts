import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

interface Slide {
  id?: string;
  type?: string;
  title: string;
  layout?: string;
  bullets: string[];
}

interface ValidationResult {
  success: boolean;
  slides?: Slide[];
  error?: string;
}

/**
 * Parse and validate AI response to ensure strict JSON compliance
 */
function parseAndValidateSlides(
  response: string
): ValidationResult {
  let rawData: any;

  // Step 1: Extract JSON from response
  try {
    // Try to find JSON array in response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      rawData = JSON.parse(jsonMatch[0]);
    } else {
      // Try parsing entire response
      rawData = JSON.parse(response);
    }
  } catch (parseError) {
    console.error('JSON Parse Error:', parseError);
    console.error('Raw Response:', response.substring(0, 500));
    
    // Attempt to fix common JSON issues
    try {
      // Remove markdown code blocks if present
      let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      // Remove leading/trailing whitespace
      cleaned = cleaned.trim();
      // Try parsing again
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        rawData = JSON.parse(jsonMatch[0]);
      } else {
        return {
          success: false,
          error: 'Failed to parse JSON from AI response. No valid JSON array found.'
        };
      }
    } catch (retryError) {
      return {
        success: false,
        error: 'Failed to parse JSON even after cleanup attempts.'
      };
    }
  }

  // Step 2: Validate it's an array
  if (!Array.isArray(rawData)) {
    console.error('Response is not an array:', typeof rawData);
    return {
      success: false,
      error: 'AI response is not a valid array of slides.'
    };
  }

  if (rawData.length === 0) {
    console.error('Empty slides array');
    return {
      success: false,
      error: 'No slides were generated.'
    };
  }

  // Step 3: Validate each slide structure
  const validatedSlides: Slide[] = [];
  
  for (let i = 0; i < rawData.length; i++) {
    const slide = rawData[i];
    
    // Validate required fields
    if (!slide.title || typeof slide.title !== 'string') {
      console.warn(`Slide ${i} missing valid title, using default`);
      slide.title = `Slide ${i + 1}`;
    }

    if (!Array.isArray(slide.bullets)) {
      console.warn(`Slide ${i} has invalid bullets, converting to array`);
      slide.bullets = slide.bullets ? [String(slide.bullets)] : [];
    }

    // Ensure bullets are strings
    slide.bullets = slide.bullets.map((b: any) => String(b));

    // Add validated slide
    validatedSlides.push({
      id: `slide-${Date.now()}-${i}`,
      type: slide.type || 'content',
      title: slide.title,
      layout: slide.layout || 'content',
      bullets: slide.bullets
    });
  }

  // Validate minimum slide count
  if (validatedSlides.length < 10) {
    console.warn(`Only ${validatedSlides.length} slides generated, which may be too few`);
  }

  return {
    success: true,
    slides: validatedSlides
  };
}

const SYSTEM_PROMPT = `You are an expert teacher and instructional designer specializing in creating clear, pedagogically sound PowerPoint presentations.

Your task is to convert lesson content into a structured slide presentation that follows best teaching practices.

=== CRITICAL RULES ===

1. SLIDE COUNT DETERMINATION:
   - Analyze content length and complexity
   - Short content (< 500 words): 15-25 slides
   - Medium content (500-1500 words): 25-40 slides
   - Long content (> 1500 words): 40-60 slides
   - Prefer MORE slides with SIMPLER content over fewer dense slides
   - Minimum 15 slides for any lesson
   - Never create overly dense slides - split complex topics

2. CONTENT SEPARATION (STRICTLY ENFORCE):
   - DEFINITIONS: Create dedicated explanation slides for concepts and definitions
   - EXAMPLES: Always place examples in SEPARATE slides (never mix with definitions)
   - ACTIVITIES: Convert practice problems or exercises into activity slides
   - QUESTIONS: Transform questions into assessment or discussion slides
   - ONE MAIN IDEA PER SLIDE: Each slide focuses on exactly one concept

3. SLIDE STRUCTURE:
   - Each slide must have ONE clear, focused idea
   - Bullet points: Maximum 8 words each
   - Maximum 5 bullets per slide (prefer 3-4)
   - Use simple, student-friendly language appropriate for the grade level
   - Avoid jargon unless it's a key term being taught

4. LOGICAL TEACHING FLOW:
   - Title slide (lesson topic)
   - Learning objectives (1-2 slides)
   - Main content slides (definitions, concepts) - one concept per slide
   - Example slides (separate from definitions) - one example per slide
   - Practice/activity slides
   - Assessment/questions slides
   - Summary/review slide

5. DETECTION RULES:
   - If you see "For example" or "Example:" → Create a new EXAMPLE slide
   - If you see "Activity" or "Try this" → Create an ACTIVITY slide
   - If you see questions (?, "What is", "How does") → Create ASSESSMENT slide
   - If you see definitions ("is defined as", "means") → Create DEFINITION slide
   - If content has multiple concepts → Create MULTIPLE slides (one per concept)

6. JSON OUTPUT SCHEMA:
   [
     {
       "title": "Slide Title Here",
       "layout": "title" | "content" | "two-column",
       "bullets": ["Short point 1", "Short point 2", "Short point 3"]
     }
   ]

7. OUTPUT REQUIREMENTS:
   - Return ONLY valid JSON (no markdown, no code blocks, no explanations)
   - Every slide MUST have: title (string), layout (string), bullets (array)
   - Bullets can be empty array [] for title slides
   - Generate appropriate number of slides based on content length (see rule 1)

=== QUALITY CHECKLIST ===
- [ ] Slide count matches content complexity (15-60 slides)
- [ ] Examples are in separate slides from definitions
- [ ] Each slide has one main idea
- [ ] Bullet points are 8 words or less
- [ ] Language matches the grade level
- [ ] Flow is logical and progressive
- [ ] Output is valid JSON only

IMPORTANT: Prioritize clarity and simplicity. When in doubt, create MORE slides with LESS content per slide.`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gradeLevel, subject, topic, content } = body;

    if (!content || content.trim().length < 50) {
      return NextResponse.json(
        { error: 'Please provide more textbook content (at least 50 characters)' },
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

    // Calculate approximate word count for context
    const wordCount = content.trim().split(/\s+/).length;
    const contentLength = wordCount < 500 ? 'short' : wordCount < 1500 ? 'medium' : 'long';

    const userPrompt = `CONTEXT:
Grade Level: ${gradeLevel}
Subject: ${subject}
Lesson Topic: ${topic}
Content Length: ${wordCount} words (${contentLength})

INSTRUCTIONS:
Analyze the textbook content below and create an appropriate number of slides based on content length and complexity.
- For ${contentLength} content, aim for the appropriate range (see system prompt)
- Adapt language complexity for ${gradeLevel} students
- Use ${subject}-appropriate terminology
- Separate definitions, examples, activities, and questions into different slides
- Ensure each slide has ONE main idea
- Keep bullet points short (max 8 words)
- Prefer MORE slides with SIMPLER content over fewer dense slides

TEXTBOOK CONTENT:
${content}

OUTPUT:
Return ONLY the JSON array of slides following the schema. No explanations, no markdown, no code blocks - just the raw JSON array.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
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

    // Validate and parse AI response
    const validationResult = parseAndValidateSlides(responseText);

    if (!validationResult.success) {
      console.error('Validation failed:', validationResult.error);
      console.error('Response preview:', responseText.substring(0, 300));
      
      return NextResponse.json(
        { 
          error: validationResult.error || 'Failed to generate valid slides. Please try again.',
          details: 'The AI response did not match the expected format.'
        },
        { status: 500 }
      );
    }

    const slides = validationResult.slides!;
    
    return NextResponse.json({ slides });

  } catch (error: any) {
    console.error('Error generating slides:', error);
    
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid API key. Please check server configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error?.message || 'An error occurred while generating slides.' },
      { status: 500 }
    );
  }
}

import PptxGenJS from "pptxgenjs";
import type { Slide, PresentationStyle, LessonInputs } from "@/types";
import { downloadFile, sanitizeFilename } from "./utils";

// Clean, professional theme with proper contrast
const THEME = {
  primary: "2563EB",      // Blue 600
  secondary: "64748B",   // Slate 500
  accent: "10B981",      // Green 500
  text: "1E293B",        // Slate 800
  textLight: "475569",   // Slate 600
  background: "FFFFFF",  // White
  backgroundAlt: "F8FAFC", // Slate 50
};

// Layout constants for consistent spacing
const LAYOUT = {
  marginX: 0.75,         // Left/right margins (0.75 inches)
  marginTop: 0.6,        // Top margin
  titleHeight: 0.8,      // Title area height
  contentTop: 1.5,       // Where content starts
  contentWidth: 8.5,     // Content area width
  contentHeight: 3.8,    // Content area height
};

// Font sizes
const FONTS = {
  titleLarge: 32,        // Main title slides
  titleNormal: 28,       // Regular slide titles
  content: 18,           // Bullet points
  footer: 10,            // Footer text
};

export async function generatePowerPoint(
  slides: Slide[],
  inputs: LessonInputs
): Promise<void> {
  const pptx = new PptxGenJS();

  pptx.author = "SmartClass";
  pptx.company = "Philippine Private Schools";
  pptx.subject = inputs.subject;
  pptx.title = inputs.topic;

  // Set standard 16:9 layout
  pptx.defineLayout({ name: "CUSTOM", width: 10, height: 5.625 });
  pptx.layout = "CUSTOM";

  // Define slide master with footer
  pptx.defineSlideMaster({
    title: "MASTER_SLIDE",
    background: { color: THEME.background },
    objects: [
      {
        text: {
          text: inputs.topic,
          options: {
            x: LAYOUT.marginX,
            y: 5.1,
            w: 4.5,
            h: 0.3,
            fontSize: FONTS.footer,
            color: THEME.textLight,
            align: "left",
            fontFace: "Arial",
          },
        },
      },
      {
        text: {
          text: `${inputs.gradeLevel} | ${inputs.subject}`,
          options: {
            x: 5.0,
            y: 5.1,
            w: 4.25,
            h: 0.3,
            fontSize: FONTS.footer,
            color: THEME.textLight,
            align: "right",
            fontFace: "Arial",
          },
        },
      },
    ],
  });

  slides.forEach((slide, index) => {
    const pptxSlide = pptx.addSlide({ masterName: "MASTER_SLIDE" });

    // Title slide (first slide)
    if (index === 0) {
      // Gradient background for title slide
      pptxSlide.background = { color: THEME.primary };
      
      // Main title
      pptxSlide.addText(slide.title, {
        x: LAYOUT.marginX,
        y: 1.8,
        w: LAYOUT.contentWidth,
        h: 1.2,
        fontSize: 40,
        bold: true,
        color: "FFFFFF",
        align: "center",
        valign: "middle",
        fontFace: "Arial",
        breakLine: true,
      });

      // Subtitle (first bullet if exists)
      if (slide.bullets.length > 0) {
        pptxSlide.addText(slide.bullets[0], {
          x: LAYOUT.marginX,
          y: 3.2,
          w: LAYOUT.contentWidth,
          h: 0.6,
          fontSize: 20,
          color: "FFFFFF",
          align: "center",
          fontFace: "Arial",
          breakLine: true,
        });
      }
    } 
    // Content slides (standard layout)
    else {
      // Title at top with consistent positioning
      pptxSlide.addText(slide.title, {
        x: LAYOUT.marginX,
        y: LAYOUT.marginTop,
        w: LAYOUT.contentWidth,
        h: LAYOUT.titleHeight,
        fontSize: FONTS.titleNormal,
        bold: true,
        color: THEME.primary,
        fontFace: "Arial",
        valign: "top",
        breakLine: true,
      });

      // Bullets below title with proper spacing and wrapping
      if (slide.bullets.length > 0) {
        // Convert bullets to TextProps format for PptxGenJS
        const bulletProps = slide.bullets.map(bullet => ({
          text: bullet,
          options: {
            bullet: { type: "number" as const },
            breakLine: true,
          }
        }));
        
        pptxSlide.addText(bulletProps, {
          x: LAYOUT.marginX + 0.3,
          y: LAYOUT.contentTop,
          w: LAYOUT.contentWidth - 0.3,
          h: LAYOUT.contentHeight,
          fontSize: FONTS.content,
          color: THEME.text,
          fontFace: "Arial",
          lineSpacing: 32,
          valign: "top",
        });
      }
    }

    if (slide.notes) {
      pptxSlide.addNotes(slide.notes);
    }
  });

  const filename = `${sanitizeFilename(inputs.topic)}_${inputs.gradeLevel}.pptx`;
  
  const blob = await pptx.write({ outputType: "blob" }) as Blob;
  downloadFile(blob, filename);
}

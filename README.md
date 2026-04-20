# SmartClass

> Turn textbook content into ready-to-teach PowerPoint slides in minutes.

SmartClass is an AI-powered tool designed for teachers to quickly transform lesson content into professional presentation slides. Simply paste your textbook material, and let AI organize it into a well-structured PowerPoint presentation.

---

## ✨ Features

- **📝 Paste Lesson Content** - Copy and paste textbook content directly into the app
- **🤖 AI-Generated Slides** - Intelligent slide generation based on content structure and length
- **🎨 Clean Design** - Professional, academic-focused slide templates
- **📥 PPTX Export** - Download fully editable PowerPoint files

---

## 🛠️ Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern utility-first styling
- **OpenAI API** - GPT-4o-mini for content analysis
- **PptxGenJS** - PowerPoint file generation

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smartclass
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   NEXT_PUBLIC_APP_NAME=SmartClass
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📖 Usage

1. **Enter lesson details** - Grade level, subject, and topic
2. **Paste textbook content** - Copy your lesson material into the text area
3. **Generate slides** - AI analyzes content and creates optimal number of slides
4. **Preview slides** - Review the generated slide structure
5. **Download PowerPoint** - Export to .pptx and edit in PowerPoint

---

## 📝 Notes

- **MVP Version** - This is a minimum viable product focused on core functionality
- **PowerPoint Editing** - All customization (images, colors, fonts) is done in PowerPoint after download
- **No Sign-up Required** - Start using immediately with your OpenAI API key
- **Privacy-First** - Your content stays private; API key is stored locally

---

## 📁 Project Structure

```
smartclass/
├── app/
│   ├── api/
│   │   ├── generate-slides/    # Slide generation endpoint
│   │   └── regenerate-slide/   # Single slide regeneration
│   ├── app/
│   │   └── page.tsx            # Main application page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   └── globals.css             # Global styles
├── components/
│   ├── app/
│   │   ├── DraftLoader.tsx     # Draft restoration UI
│   │   ├── InputFormSimplified.tsx
│   │   └── SlidePreview.tsx    # Slide preview grid
│   ├── landing/
│   │   ├── Hero.tsx
│   │   └── Features.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── draft-storage.ts        # localStorage draft handling
│   ├── lesson-plan.ts          # Lesson plan generation
│   ├── pptx-generator.ts       # PowerPoint export
│   ├── store.ts                # Zustand state management
│   └── utils.ts                # Utility functions
└── types/
    └── index.ts                # TypeScript interfaces
```

---

## 🔑 Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Click "Create new secret key"
5. Copy the key and add it to your `.env.local` file

**Note:** Keep your API key secure and never commit it to version control.

---

## 🤝 Contributing

This is an MVP project. Contributions, issues, and feature requests are welcome.

---

## 📄 License

Created by Marvin Villaluz

---

## � Future Enhancements

- Image insertion support
- Custom slide templates
- Collaborative editing
- Cloud storage integration
- Multi-language support

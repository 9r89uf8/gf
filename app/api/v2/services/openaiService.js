import OpenAI from 'openai';
import { adminDb } from '@/app/utils/firebaseAdmin';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export async function generateBlogArticle({ topic = null, category = 'guias' } = {}) {
  try {
    // Fetch all existing blog titles to avoid duplicates
    const existingPostsSnapshot = await adminDb
      .firestore()
      .collection('blog-posts')
      .select('title')
      .get();
    
    const existingTitles = [];
    existingPostsSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.title) {
        existingTitles.push(data.title);
      }
    });

    // Construct the system prompt
    const systemPrompt = `Eres un experto escritor de contenido SEO en español para el blog de NoviaChat.com, una plataforma de novias virtuales con IA.

EJEMPLO DE ARTÍCULO (usa esta estructura y estilo):

Título: "Novia Virtual en Español: La Ventaja de Hablar en Tu Idioma Nativo"
Categoría: guias
Tags: ["novia virtual", "español", "idioma", "cultura", "comunicación"]

Contenido HTML:
<h2>La Importancia del Idioma en las Relaciones Virtuales</h2>
<p>Cuando buscas una <strong>novia virtual</strong>, el idioma es mucho más que palabras. Es la puerta a una conexión auténtica, la expresión de tu cultura y la comodidad de ser completamente tú mismo. En <a href="http://www.noviachat.com">NoviaChat.com</a>, entendemos que los hispanohablantes merecen experiencias en su idioma nativo, sin barreras ni traducciones torpes.</p>

INSTRUCCIONES:
1. Crea un artículo de 1800-2000 palabras sobre novias virtuales/IA
2. Usa HTML para el formato (h2, h3, p, ul, li, strong, a)
3. Incluye enlaces a http://www.noviachat.com naturalmente
4. Usa las palabras clave: "novia virtual", "compañera ia", "novia ia", "chicas ia"
5. Mantén un tono profesional pero accesible
6. Incluye listas, subsecciones y estructura clara
7. Optimiza para SEO en español
8. Evita contenido explícito o inapropiado

TÍTULOS EXISTENTES (NO repetir estos títulos):
${existingTitles.map(title => `- ${title}`).join('\n')}

${topic ? `TEMA ESPECÍFICO: ${topic}` : 'TEMA: Elige un tema relevante sobre novias virtuales que no se haya cubierto'}`;

    const userPrompt = `Genera un artículo completo para el blog siguiendo el ejemplo proporcionado. 

Devuelve un JSON con esta estructura exacta:
{
  "title": "Título del artículo",
  "excerpt": "Resumen de 150-200 caracteres",
  "category": "${category}",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "content": "Contenido HTML completo del artículo"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });

    const generatedArticle = JSON.parse(completion.choices[0].message.content);

    // Validate the response structure
    if (!generatedArticle.title || !generatedArticle.content || !generatedArticle.excerpt) {
      throw new Error('Invalid article structure generated');
    }

    // Generate slug from title
    const slug = generateSlug(generatedArticle.title);

    // Check if slug already exists
    const existingSlugSnapshot = await adminDb
      .firestore()
      .collection('blog-posts')
      .where('slug', '==', slug)
      .get();

    if (!existingSlugSnapshot.empty) {
      // If slug exists, append a number
      const timestamp = Date.now();
      generatedArticle.slug = `${slug}-${timestamp}`;
    } else {
      generatedArticle.slug = slug;
    }

    return {
      success: true,
      article: generatedArticle
    };

  } catch (error) {
    console.error('Error generating blog article:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate article'
    };
  }
}
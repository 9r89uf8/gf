import OpenAI from 'openai';
import { adminDb } from '@/app/utils/firebaseAdmin';

// Initialize X.AI client using OpenAI SDK
const xaiClient = new OpenAI({
  apiKey: process.env.XIA_API_KEY, // Using the environment variable as defined
  baseURL: "https://api.x.ai/v1",
});

// Country codes mapping - Updated to only include 4 countries
const COUNTRIES = {
  mexico: { code: 'mx', name: 'México', language: 'es' },
  argentina: { code: 'ar', name: 'Argentina', language: 'es' },
  spain: { code: 'es', name: 'España', language: 'es' },
  usa: { code: 'us', name: 'Estados Unidos', language: 'en' }
};

/**
 * Fetch news for a specific country
 * @param {string} countryCode - Country code (mx, ar, es, us)
 * @param {string} adminUserId - ID of the admin user triggering the fetch
 * @returns {Promise<Object>} Object with news data
 */
export async function fetchNewsForCountry(countryCode, adminUserId) {
  try {
    console.log(`Fetching news for country: ${countryCode}...`);
    
    // Validate country code
    const countryInfo = Object.values(COUNTRIES).find(c => c.code === countryCode);
    if (!countryInfo) {
      throw new Error(`Invalid country code: ${countryCode}`);
    }

    // Get current date for context
    const now = new Date();
    const currentDateEnglish = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const currentDateISO = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const yesterday = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const yesterdayEnglish = yesterday.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
    const yesterdayISO = yesterday.toISOString().split('T')[0];


    // Call X.AI API with Live Search enabled
    const completion = await xaiClient.chat.completions.create({
      model: "grok-3-mini",
      messages: [
        {
          role: "system",
          content: `You are a news aggregator that provides the most current information based on real-time search results. Today's date is ${currentDateISO}. Only use information from the live search results provided. Provide a short news digest in Spanish (or English for USA).`
        },
        {
          role: "user",
          content: `Provide me a short news digest for ${countryInfo.name} from ${currentDateISO} (today) and ${yesterdayISO} (yesterday). Include current events, sports results, entertainment/celebrity news. Format as a readable text digest, not JSON. Focus on news relevant to young adults aged 18-45. Write in ${countryInfo.language === 'es' ? 'Spanish' : 'English'}.`
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      // Enable Live Search with specific parameters
      search_parameters: {
        mode: "on", // Let the model decide when to search
        sources: [
          {
            type: "news",
            max_results: 20
          },
          {
            type: "x",
            max_results: 10
          }
        ],
        from_date: yesterdayISO, // Search from yesterday
        to_date: currentDateISO, // Up to today
        max_search_results: 20, // Maximum total results
        return_citations: false // Get source URLs
      }
    });

    // Parse the response
    const newsText = completion.choices[0].message.content;

    // Save to Firebase
    const timestamp = new Date();
    const docRef = adminDb.firestore()
      .collection('news-updates')
      .doc(countryCode);
    
    await docRef.set({
      country: countryCode,
      newsText: newsText,
      lastUpdated: timestamp,
      fetchedBy: adminUserId,
    }, { merge: true });

    console.log('News saved to Firebase successfully');

    return {
      success: true,
      data: {
        country: countryCode,
        newsText: newsText,
        lastUpdated: timestamp
      },
      timestamp: timestamp.toISOString()
    };

  } catch (error) {
    console.error('Error fetching news:', error);
    throw new Error(`Failed to fetch news: ${error.message}`);
  }
}

/**
 * Get news for a specific country from Firebase
 * @param {string} countryCode - Country code (mx, ar, co, etc.)
 * @returns {Promise<Object>} News data for the country
 */
export async function getNewsByCountry(countryCode) {
  try {
    const docRef = await adminDb.firestore()
      .collection('news-updates')
      .doc(countryCode)
      .get();

    if (!docRef.exists) {
      return {
        success: false,
        message: 'No news found for this country'
      };
    }

    const data = docRef.data();
    return {
      success: true,
      data: data
    };

  } catch (error) {
    console.error('Error getting news by country:', error);
    throw new Error(`Failed to get news: ${error.message}`);
  }
}

/**
 * Get all news from Firebase
 * @returns {Promise<Object>} All news data
 */
export async function getAllNews() {
  try {
    const snapshot = await adminDb.firestore()
      .collection('news-updates')
      .get();

    const newsData = {};
    snapshot.forEach(doc => {
      newsData[doc.id] = doc.data();
    });

    return {
      success: true,
      data: newsData
    };

  } catch (error) {
    console.error('Error getting all news:', error);
    throw new Error(`Failed to get all news: ${error.message}`);
  }
}

/**
 * Update news text for a country
 * @param {string} countryCode - Country code
 * @param {string} newsText - Updated news text
 * @param {string} adminUserId - Admin user ID
 * @returns {Promise<Object>} Update result
 */
export async function updateNewsText(countryCode, newsText, adminUserId) {
  try {
    const docRef = adminDb.firestore()
      .collection('news-updates')
      .doc(countryCode);

    await docRef.update({
      newsText: newsText,
      lastUpdated: new Date(),
      lastEditedBy: adminUserId
    });

    return {
      success: true,
      message: 'News updated successfully'
    };

  } catch (error) {
    console.error('Error updating news:', error);
    throw new Error(`Failed to update news: ${error.message}`);
  }
}

/**
 * Format news for AI conversation context
 * @param {string} countryCode - Country code
 * @returns {Promise<string>} Formatted news string for AI
 */
export async function formatNewsForAI(countryCode) {
  try {
    const newsResult = await getNewsByCountry(countryCode);

    if (!newsResult.success || !newsResult.data) {
      return '';
    }

    const { newsText } = newsResult.data;
    
    // If no news text, return empty
    if (!newsText) {
      return '';
    }

    // Add a header and return the news text
    const countryName = Object.values(COUNTRIES).find(c => c.code === countryCode)?.name || countryCode;
    return `📰 Últimas noticias de ${countryName}:\n\n${newsText}`;

  } catch (error) {
    console.error('Error formatting news for AI:', error);
    return '';
  }
}
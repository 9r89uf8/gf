import snoowrap from 'snoowrap';

/**
 * Posts a blog post link to Reddit
 * @param {string} title - The title of the blog post
 * @param {string} url - The full URL of the blog post
 * @param {string} excerpt - The excerpt/description of the blog post
 * @returns {Promise<{success: boolean, submissionUrl?: string, error?: string}>}
 */
export async function postToReddit(title, url, excerpt = '') {

  try {
    // Create Reddit client with script-type authentication
    const reddit = new snoowrap({
      userAgent: process.env.REDDIT_USER_AGENT,
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      username: process.env.REDDIT_USERNAME,
      password: process.env.REDDIT_PASSWORD
    });

    // Create formatted text content with excerpt and link
    const postText = `${excerpt}\n\n**Lee el artículo completo:** ${url}\n\n---\n*Este post fue compartido automáticamente desde [NoviAChat](https://www.noviachat.com) - Tu novia virtual AI perfecta*`;

    // Submit as text post with link in the body
    const submission = await reddit.submitSelfpost({
      subredditName: process.env.REDDIT_TARGET_SUBREDDIT,
      title: title,
      text: postText
    });

    // Construct the submission URL using the ID
    const submissionId = submission.name.substring(3); // Remove 't3_' prefix
    const submissionUrl = `https://www.reddit.com/r/${process.env.REDDIT_TARGET_SUBREDDIT}/comments/${submissionId}/`;
    
    console.log(`Successfully posted to Reddit: ${submissionUrl}`);
    
    return {
      success: true,
      submissionUrl: submissionUrl
    };
  } catch (error) {
    console.error('Error posting to Reddit:', error);
    return {
      success: false,
      error: error.message || 'Failed to post to Reddit'
    };
  }
}
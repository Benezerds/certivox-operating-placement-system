const BASE_URL = "https://www.googleapis.com/youtube/v3"; // Ensure BASE_URL is defined
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

export const getYouTubeVideoMetrics = async (videoId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=statistics&id=${videoId}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch YouTube metrics");
    }

    const data = await response.json();

    if (data.items.length === 0) {
      throw new Error("No data found for this video ID");
    }

    // Extract engagement metrics
    const { viewCount, likeCount, commentCount } = data.items[0].statistics;

    return {
      views: parseInt(viewCount || 0, 10),
      likes: parseInt(likeCount || 0, 10),
      comments: parseInt(commentCount || 0, 10),
    };
  } catch (error) {
    console.error("Error fetching YouTube metrics:", error);
    return { views: 0, likes: 0, comments: 0 }; // Default values in case of error
  }
};
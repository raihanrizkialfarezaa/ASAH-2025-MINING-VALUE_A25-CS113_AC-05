import prisma from '../src/config/database.js';

async function checkAIIntegration() {
  console.log('=== Checking AI Integration Data ===\n');

  try {
    const chatbotCount = await prisma.chatbotInteraction.count();
    console.log(`✓ Chatbot Interactions: ${chatbotCount}`);

    const predictionCount = await prisma.predictionLog.count();
    console.log(`✓ Prediction Logs: ${predictionCount}`);

    const recommendationCount = await prisma.recommendationLog.count();
    console.log(`✓ Recommendation Logs: ${recommendationCount}`);

    const recentChatbot = await prisma.chatbotInteraction.findFirst({
      orderBy: { timestamp: 'desc' },
      select: {
        userQuestion: true,
        aiResponse: true,
        timestamp: true,
      },
    });

    if (recentChatbot) {
      console.log('\nMost Recent Chatbot Interaction:');
      console.log(`Question: ${recentChatbot.userQuestion}`);
      const aiResponseStr =
        typeof recentChatbot.aiResponse === 'string'
          ? recentChatbot.aiResponse
          : JSON.stringify(recentChatbot.aiResponse);
      console.log(`Answer: ${aiResponseStr.substring(0, 100)}...`);
      console.log(`Date: ${recentChatbot.timestamp}`);
    }

    const recentRecommendation = await prisma.recommendationLog.findFirst({
      orderBy: { createdAt: 'desc' },
      select: {
        recommendationType: true,
        selectedStrategy: true,
        scenario: true,
        createdAt: true,
      },
    });

    if (recentRecommendation) {
      console.log('\nMost Recent Recommendation:');
      console.log(`Type: ${recentRecommendation.recommendationType}`);
      console.log(`Strategy: ${recentRecommendation.selectedStrategy}`);
      console.log(`Date: ${recentRecommendation.createdAt}`);
    }

    const roadSegments = await prisma.roadSegment.findMany({
      where: { isActive: true },
      select: { id: true, code: true, name: true },
      take: 3,
    });
    console.log(`\n✓ Active Road Segments: ${roadSegments.length}`);
    roadSegments.forEach((r) => console.log(`  - ${r.code}: ${r.name} (${r.id})`));

    const excavators = await prisma.excavator.findMany({
      select: { id: true, code: true, model: true },
      take: 3,
    });
    console.log(`\n✓ Excavators: ${excavators.length}`);
    excavators.forEach((e) => console.log(`  - ${e.code}: ${e.model} (${e.id})`));

    console.log('\n=== AI Integration Check Complete ===');
  } catch (error) {
    console.error('Error checking AI integration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAIIntegration();

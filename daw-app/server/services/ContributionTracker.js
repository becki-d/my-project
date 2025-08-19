import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);
const ACTION_WEIGHTS = {
  'note-add': 1.0,
  'audio-record': 1.5,
  'midi-edit': 0.8
};

export class ContributionTracker {
  static async track(userId, projectId, actionType) {
    const score = ACTION_WEIGHTS[actionType] || 0.5;
    await redis.zincrby(
      `contributions:${projectId}`, 
      score, 
      userId
    );
  }

  static async getContributions(projectId) {
    return redis.zrange(
      `contributions:${projectId}`, 
      0, -1, 
      'WITHSCORES'
    );
  }
}
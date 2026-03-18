export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json([
    {
      agentId: 'star',
      name: 'Star',
      isMain: true,
      state: 'idle',
      detail: '待命中，随时准备为你服务',
      updated_at: new Date().toISOString(),
      area: 'breakroom',
      source: 'local',
      joinKey: null,
      authStatus: 'approved',
      authExpiresAt: null,
      lastPushAt: null
    }
  ]);
}

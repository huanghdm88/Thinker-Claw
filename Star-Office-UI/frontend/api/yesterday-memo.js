export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    success: false,
    msg: '没有找到昨日日记'
  });
}

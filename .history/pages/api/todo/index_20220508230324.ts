import prisma from '../../../lib/prisma';

export default async function handle(req, res) {
  const { title, content } = req.body;


  const result = await prisma.todo.create({
    data: {
      title: title,
      content: content,
	  published: true,
    },
  });
  res.json(result);
}

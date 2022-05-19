import { PrismaClient,User } from "@prisma/client";

const prisma = new PrismaClient();

const createUsers = async () => {
	const promises = [...Array(3)].map((_,i) => {
		const userId = `${i +1}`;
		return prisma.user.upsert({
			where:{id:userId},
			update:{},
			create:{
				id:userId,
				name:`seed_user_${userId}`,
			},
		});
	});
	return await Promise.all(promises);
}

export const createTodos = async (title,content) => {
	const promises = [...Array(3)].map((_,i) => {
		const number = i + 1;
		return prisma.todo.create({
			data: {
				title:title,
				content:content,
			},
		});
	});
	return await Promise.all(promises);
}

// const main = async () => {
// 	const users = await createUsers();
// 	const promises = users.map((user) => {
// 		return createTodos(user);
// 	});
// 	const todos = await Promise.all(promises);
// 	console.log({
// 		users,
// 		todos,
// 	});
// };

// main()
// .catch((e) => {
// 	console.error(e);
// 	process.exit(1);
// })
// .finally(async () => {
// 	await prisma.$disconnect();
// });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: {
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice@example.com',
      password,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob@example.com',
      password,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'carol@example.com' },
    update: {},
    create: {
      firstName: 'Carol',
      lastName: 'Davis',
      email: 'carol@example.com',
      password,
    },
  });

  const post1 = await prisma.post.create({
    data: {
      content: 'Excited to join BuddyScript! This platform looks amazing for sharing ideas and connecting with friends.',
      visibility: 'PUBLIC',
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      content: 'Just finished a great book on software architecture. Highly recommend "Clean Architecture" by Robert Martin!',
      visibility: 'PUBLIC',
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      content: 'Working on a personal project this weekend. Sometimes the best code is written in silence at 2 AM.',
      visibility: 'PRIVATE',
      authorId: user1.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      content: 'Anyone else excited about the new React Server Components? Game changer for web development!',
      visibility: 'PUBLIC',
      authorId: user3.id,
    },
  });

  const comment1 = await prisma.comment.create({
    data: {
      content: 'Welcome aboard, Alice! Great to have you here.',
      postId: post1.id,
      authorId: user2.id,
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content: 'Clean Architecture is a classic! Have you read The Pragmatic Programmer?',
      postId: post2.id,
      authorId: user1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: 'Absolutely, both are essential reads for any developer!',
      postId: post2.id,
      authorId: user3.id,
      parentId: comment2.id,
    },
  });

  await prisma.like.createMany({
    data: [
      { postId: post1.id, userId: user2.id },
      { postId: post1.id, userId: user3.id },
      { postId: post2.id, userId: user1.id },
      { postId: post2.id, userId: user3.id },
      { postId: post4.id, userId: user1.id },
      { postId: post4.id, userId: user2.id },
      { commentId: comment1.id, userId: user1.id },
      { commentId: comment1.id, userId: user3.id },
    ],
  });

  console.log('Seed data created successfully!');
  console.log('Test accounts (all use password: password123):');
  console.log('  alice@example.com');
  console.log('  bob@example.com');
  console.log('  carol@example.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

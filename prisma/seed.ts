import { PrismaClient } from '@prisma/client';

//mockData
import { users as usersMock } from './mockData/users';
import { bios as biosMock } from './mockData/users';
import { posts as postsMock } from './mockData/posts';
import { tags as tagsMock } from './mockData/posts';

const prisma = new PrismaClient();

async function main() {
  // Clean current database
  await prisma.tag.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.userProfile.deleteMany({});
  await prisma.user.deleteMany({});

  // Create Users
  const users = await prisma.user.createManyAndReturn({
    data: usersMock,
  });

  const firstTenUsers = users.slice(0, 10);

  // Create User Profiles
  for (const user of users) {
    // get random bio
    const randomBioIndex = Math.floor(Math.random() * biosMock.length);
    const bio = biosMock[randomBioIndex];

    // generate random avatar
    const randomAvatarUrl = `https://avatars.dicebear.com/api/initials/${user.username}.svg`;

    await prisma.userProfile.create({
      data: {
        userId: user.id,
        bio: bio,
        avatar: randomAvatarUrl,
      },
    });
  }

  // Create Tags
  const tags = await prisma.tag.createManyAndReturn({
    data: tagsMock,
  });

  // Create Posts
  for (const user of firstTenUsers) {
    const randomPostsLength = Math.floor(Math.random() * postsMock.length);

    const shuffledPosts = [...postsMock]
      .sort(() => Math.random() - 0.5)
      .slice(0, randomPostsLength);

    // Create posts for each user
    const posts = await prisma.post.createManyAndReturn({
      data: shuffledPosts.map((post) => {
        return {
          ...post,
          authorId: user.id,
        };
      }),
    });

    // Connect random tags to each post
    for (const post of posts) {
      const randomTagsLength = Math.floor(Math.random() * tagsMock.length);
      const shuffledTags = [...tags]
        .sort(() => Math.random() - 0.5)
        .slice(0, randomTagsLength);

      // Connect tags to post in one update operation
      await prisma.post.update({
        where: { id: post.id },
        data: {
          tags: {
            connect: shuffledTags.map((tag) => ({ id: tag.id })),
          },
        },
      });
    }
  }
}

main()
  .then(() => {
    console.log('🌱 Seeding complete.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect().finally(() => process.exit(1));
  });

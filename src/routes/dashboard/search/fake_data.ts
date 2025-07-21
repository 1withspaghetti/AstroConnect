import type { PostPreview } from '@/types/post';

const posts: PostPreview[] = [
	{
		id: 1,
		title: 'Lorem ipsum dolor sit amet',
		desc: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		images: [
			'https://images.unsplash.com/photo-1505579962197-df174377e13f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			'https://images.unsplash.com/photo-1719494693285-acabe80c76b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
			'https://images.unsplash.com/photo-1708111175269-f99a812a1fe5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Undergraduate',
		prereq: 'Basic Astronomy Knowledge',
		tags: ['Telescope', 'Easy', 'Milky Way'],
		open: true,
		createdAt: '2025-07-19T12:00:00Z',
		createdBy: {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			isAdmin: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	},
	{
		id: 2,
		title:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
		desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
		images: [
			'https://images.unsplash.com/photo-1719494693285-acabe80c76b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Graduate',
		prereq: 'Advanced Astronomy Knowledge',
		tags: ['Radio', 'Difficult'],
		open: true,
		createdAt: '2025-07-17T12:00:00Z',
		createdBy: {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			isAdmin: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	},
	{
		id: 3,
		title:
			'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum',
		desc: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
		images: [
			'https://images.unsplash.com/photo-1708111175269-f99a812a1fe5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Post-Doctoral',
		prereq: 'Expert Astronomy Knowledge',
		tags: ['NASA', 'Galaxy', 'Hubble Space Telescope', 'Easy'],
		open: true,
		createdAt: '2025-07-18T12:00:00Z',
		createdBy: {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			isAdmin: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	},
	{
		id: 4,
		title: 'Lorem ipsum dolor sit amet',
		desc: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		images: [
			'https://images.unsplash.com/photo-1505579962197-df174377e13f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Undergraduate',
		prereq: 'Basic Astronomy Knowledge',
		tags: ['Telescope', 'Easy', 'Milky Way'],
		open: true,
		createdAt: '2025-07-19T12:00:00Z',
		createdBy: {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			isAdmin: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	},
	{
		id: 5,
		title:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
		desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
		images: [
			'https://images.unsplash.com/photo-1719494693285-acabe80c76b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Graduate',
		prereq: 'Advanced Astronomy Knowledge',
		tags: ['Radio', 'Difficult'],
		open: true,
		createdAt: '2025-07-17T12:00:00Z',
		createdBy: {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			isAdmin: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	},
	{
		id: 6,
		title:
			'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum',
		desc: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
		images: [
			'https://images.unsplash.com/photo-1708111175269-f99a812a1fe5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Post-Doctoral',
		prereq: 'Expert Astronomy Knowledge',
		tags: ['NASA', 'Galaxy', 'Hubble Space Telescope', 'Easy'],
		open: true,
		createdAt: '2025-07-18T12:00:00Z',
		createdBy: {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			isAdmin: false,
			createdAt: new Date(),
			updatedAt: new Date()
		}
	}
];

export default posts;

const tags = posts.flatMap((item) => item.tags);

export const uniqueTags = Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b));

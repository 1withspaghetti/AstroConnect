import type { Post } from '@/types/post';

const posts: Post[] = [
	{
		id: 1,
		isDraft: false,
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
		isOpen: true,
		closesAt: new Date('2025-07-28T06:59:59Z'),
		maxSlots: 4,
		applications: 2,
		createdAt: new Date('2025-07-19T12:00:00Z'),
		owner: {
			id: 1,
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			bio: 'Astronomy enthusiast and researcher with a passion for exploring the cosmos.'
		},
		questions: [
			{
				id: 'q1',
				type: 1, // TEXT
				label: 'What is your current major?',
				required: true,
				min: 1,
				max: 100
			},
			{
				id: 'q2',
				type: 2, // TEXTAREA
				label: 'Tell us about your experience with astronomy.',
				required: true,
				min: 10,
				max: 1000
			},
			{
				id: 'q3',
				type: 3, // SELECT
				label: 'What part of this research are you most interested in?',
				options: [
					'Observational Astronomy',
					'Theoretical Astronomy',
					'Planetary Science',
					'Cosmology'
				],
				required: true
			},
			{
				id: 'q4',
				type: 4, // MULTISELECT
				label: 'What skills do you bring to this research?',
				options: ['Data Analysis', 'Programming', 'Field Work'],
				required: true,
				min: 1,
				max: 3
			},
			{
				id: 'q5',
				type: 5, // FILE
				label: 'Upload your CV',
				required: false
			}
		]
	},
	{
		id: 2,
		isDraft: false,
		title:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
		desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
		images: [
			'https://images.unsplash.com/photo-1719494693285-acabe80c76b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Graduate',
		prereq: 'Advanced Astronomy Knowledge',
		tags: ['Radio', 'Difficult'],
		isOpen: true,
		maxSlots: 2,
		applications: 0,
		createdAt: new Date('2025-07-17T12:00:00Z'),
		closesAt: null,
		owner: {
			id: 1,
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			bio: 'Astronomy enthusiast and researcher with a passion for exploring the cosmos.'
		},
		questions: []
	},
	{
		id: 3,
		isDraft: false,
		title:
			'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum',
		desc: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
		images: [
			'https://images.unsplash.com/photo-1708111175269-f99a812a1fe5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Post-Doctoral',
		prereq: 'Expert Astronomy Knowledge',
		tags: ['NASA', 'Galaxy', 'Hubble Space Telescope', 'Easy'],
		isOpen: true,
		closesAt: new Date('2025-07-25T06:59:59Z'),
		createdAt: new Date('2025-07-18T12:00:00Z'),
		maxSlots: null,
		applications: 1,
		owner: {
			id: 1,
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			bio: 'Astronomy enthusiast and researcher with a passion for exploring the cosmos.'
		},
		questions: []
	},
	{
		id: 4,
		isDraft: false,
		title: 'Lorem ipsum dolor sit amet',
		desc: 'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
		images: [
			'https://images.unsplash.com/photo-1505579962197-df174377e13f?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Undergraduate',
		prereq: 'Basic Astronomy Knowledge',
		tags: ['Telescope', 'Easy', 'Milky Way'],
		isOpen: true,
		createdAt: new Date('2025-07-19T12:00:00Z'),
		maxSlots: null,
		applications: 0,
		closesAt: null,
		owner: {
			id: 1,
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			bio: 'Astronomy enthusiast and researcher with a passion for exploring the cosmos.'
		},
		questions: []
	},
	{
		id: 5,
		isDraft: true,
		title:
			'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium',
		desc: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
		images: [
			'https://images.unsplash.com/photo-1719494693285-acabe80c76b6?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Graduate',
		prereq: 'Advanced Astronomy Knowledge',
		tags: ['Radio', 'Difficult'],
		isOpen: false,
		createdAt: new Date('2025-07-17T12:00:00Z'),
		maxSlots: 3,
		applications: 0,
		closesAt: null,
		owner: {
			id: 1,
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			bio: 'Astronomy enthusiast and researcher with a passion for exploring the cosmos.'
		},
		questions: []
	},
	{
		id: 6,
		isDraft: true,
		title:
			'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum',
		desc: 'Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
		images: [
			'https://images.unsplash.com/photo-1708111175269-f99a812a1fe5?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
		],
		careerStage: 'Post-Doctoral',
		prereq: 'Expert Astronomy Knowledge',
		tags: ['NASA', 'Galaxy', 'Hubble Space Telescope', 'Easy'],
		isOpen: false,
		createdAt: new Date('2025-07-18T12:00:00Z'),
		maxSlots: 5,
		applications: 1,
		closesAt: null,
		owner: {
			id: 1,
			name: 'John Doe',
			email: 'john.doe@example.com',
			pfp: 'https://randomuser.me/api/portraits/men/1.jpg',
			bio: 'Astronomy enthusiast and researcher with a passion for exploring the cosmos.'
		},
		questions: []
	}
];

export default posts;

const tags = posts.flatMap((item) => item.tags);

export const uniqueTags = Array.from(new Set(tags)).sort((a, b) => a.localeCompare(b));

export const BRANCH_CONFIG = {
  cse: {
    name: 'Computer Science Engineering',
    shortName: 'CSE',
    slug: 'cse',
    color: 'bg-blue-500',
    hoverColor: 'hover:bg-blue-600',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-700',
  },
  ece: {
    name: 'Electronics & Communication Engineering',
    shortName: 'ECE',
    slug: 'ece',
    color: 'bg-purple-500',
    hoverColor: 'hover:bg-purple-600',
    lightColor: 'bg-purple-100',
    textColor: 'text-purple-700',
  },
  eee: {
    name: 'Electrical & Electronics Engineering',
    shortName: 'EEE',
    slug: 'eee',
    color: 'bg-yellow-500',
    hoverColor: 'hover:bg-yellow-600',
    lightColor: 'bg-yellow-100',
    textColor: 'text-yellow-700',
  },
  me: {
    name: 'Mechanical Engineering',
    shortName: 'ME',
    slug: 'me',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
    lightColor: 'bg-red-100',
    textColor: 'text-red-700',
  },
  ce: {
    name: 'Civil Engineering',
    shortName: 'CE',
    slug: 'ce',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
    lightColor: 'bg-green-100',
    textColor: 'text-green-700',
  },
  it: {
    name: 'Information Technology',
    shortName: 'IT',
    slug: 'it',
    color: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600',
    lightColor: 'bg-indigo-100',
    textColor: 'text-indigo-700',
  },
  che: {
    name: 'Chemical Engineering',
    shortName: 'ChemE',
    slug: 'che',
    color: 'bg-orange-500',
    hoverColor: 'hover:bg-orange-600',
    lightColor: 'bg-orange-100',
    textColor: 'text-orange-700',
  },
  biotech: {
    name: 'Biotechnology Engineering',
    shortName: 'BioTech',
    slug: 'biotech',
    color: 'bg-teal-500',
    hoverColor: 'hover:bg-teal-600',
    lightColor: 'bg-teal-100',
    textColor: 'text-teal-700',
  },
} as const

export type BranchSlug = keyof typeof BRANCH_CONFIG

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const

export type Semester = (typeof SEMESTERS)[number]

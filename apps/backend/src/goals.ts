import { PROJECTS, type Project } from '@stardew/game-data';

export type GoalDueDate = { season: 'Spring' | 'Summer' | 'Fall' | 'Winter'; day: number; year: number };
export type GoalInput = { itemId?: string; title?: string; personal?: boolean; dueDate?: GoalDueDate };

export function goalTitleKey(value: string): string {
  return value.toLowerCase().replace(/\b(build|buy|craft|make|upgrade|a|an|the|goal|farm)\b/g, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
}

export function findGoalProject(value: string): Project | undefined {
  const key = goalTitleKey(value);
  return PROJECTS.find(project => goalTitleKey(project.name) === key || goalTitleKey(project.id) === key);
}

export function resolveGoalInput(input: GoalInput) {
  const project = input.itemId ? PROJECTS.find(entry => entry.id === input.itemId) : undefined;
  if (input.itemId && !project) throw Object.assign(new Error('Unknown project'), { status: 400 });
  if (!project && !input.title?.trim()) throw Object.assign(new Error('Choose a project or enter a custom goal'), { status: 400 });
  const target = project ? {
    cost: project.cost ?? null,
    prerequisite: project.prerequisite ?? null,
    category: project.category,
    source: project.source,
    dueDate: input.dueDate ?? null,
  } : { dueDate: input.dueDate ?? null };
  return {
    itemId: project?.id ?? null,
    title: project ? `${project.category === 'building' ? 'Build' : project.category === 'machine' ? 'Make' : 'Complete'} ${project.name}` : input.title!.trim(),
    requirements: project ? { ...project.materials } : {},
    target,
    personal: Boolean(input.personal),
    project: project ?? null,
  };
}

export function enrichGoal<T extends { itemId?: string | null }>(goal: T) {
  const project = goal.itemId ? PROJECTS.find(entry => entry.id === goal.itemId) ?? null : null;
  return { ...goal, project };
}

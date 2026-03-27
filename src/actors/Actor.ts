/**
 * Base Actor class in the Screenplay Pattern.
 * Actors perform tasks and recall abilities to accomplish test goals.
 */
export interface Performable {
  performAs(actor: Actor): Promise<unknown>;
}

export interface Answerable<T> {
  answeredBy(actor: Actor): Promise<T>;
}

export class Actor {
  private name: string;
  private abilities: Map<string, any> = new Map();

  constructor(name: string) {
    this.name = name;
  }

  /**
   * Grant the actor a new ability
   */
  public can(abilityType: new (...args: any[]) => any, ...args: any[]): this {
    const ability = new abilityType(...args);
    this.abilities.set(abilityType.name, ability);
    return this;
  }

  /**
   * Perform one or more tasks/actions as this actor
   */
  public async attemptsTo(...activities: Performable[]): Promise<void> {
    for (const activity of activities) {
      await activity.performAs(this);
    }
  }

  /**
   * Get an ability the actor has been granted
   */
  public recall<T>(abilityType: new (...args: any[]) => any): T {
    const ability = this.abilities.get(abilityType.name);
    if (!ability) {
      throw new Error(`Actor "${this.name}" does not have the ability "${abilityType.name}"`);
    }
    return ability as T;
  }

  /**
   * Check if actor has a specific ability
   */
  public hasAbility(abilityType: new (...args: any[]) => any): boolean {
    return this.abilities.has(abilityType.name);
  }

  /**
   * Ask a question about the current application state
   */
  public async asksFor<T>(question: Answerable<T>): Promise<T> {
    return question.answeredBy(this);
  }

  /**
   * Get actor name for logging/reporting
   */
  public getName(): string {
    return this.name;
  }
}

/**
 * Factory function to create an actor with a name
 */
export const Actor_Builder = (name: string): Actor => {
  return new Actor(name);
};

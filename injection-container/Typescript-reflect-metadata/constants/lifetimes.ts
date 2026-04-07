export const lifeTime = {
    SINGLETON: "Singleton",
    TRANSIENT: "Transient",
    SCOPED: "Scoped"
} as const;

export type ServiceLifetime = typeof lifeTime[keyof typeof lifeTime];

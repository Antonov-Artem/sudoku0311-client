export type UserActivityReward = {
    claimed: boolean;
    activityReward: {
        reward: {
            quantity: number;
            currency: {
                name: string;
            } | null;
        };
    };
};

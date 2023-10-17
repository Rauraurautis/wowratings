type AchievementData = {
    id: number;
    achievement: {
        key: {
            href: string;
        };
        name: string;
        id: number;
    };
    criteria: {
        id: number;
        is_completed: boolean;
    };
    completed_timestamp: number;
};

const ratings = {
    5356: 2400,
    5343: 2400,
    5342: 2300,
    5357: 2300,
    5341: 2200,
    5355: 2200,
    5340: 2100,
    5354: 2100,
    5353: 2000,
    5339: 2000,
    5338: 1900,
    5359: 1900,
    5352: 1800,
    5337: 1800,
    5351: 1700,
    5336: 1700,
    5335: 1600,
    5350: 1600,
    5349: 1500,
    5334: 1500,
    5348: 1400,
    5333: 1400,
    5347: 1300,
    5332: 1300,
    5331: 1200,
    5346: 1200,
    5345: 1100,
    5330: 1100
}

export const derivePvpAchievements = (achievements: AchievementData[]) => {
    let highest = 0
    const ratingKeys = Object.keys(ratings)
    for (let entry of achievements) {
        if (ratingKeys.includes(entry.id.toString()) && ratings[entry.id as keyof typeof ratings] > highest) {
            highest = ratings[entry.id as keyof typeof ratings]
        }
    }
    return { highestRbg: highest }
}
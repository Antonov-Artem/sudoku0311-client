import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { clsx } from "clsx/lite";
import {
    claimUserActivityReward,
    getUserActivityReward,
} from "entities/activity-reward";
import { getBalance } from "entities/balance";
import { claimUserTaskActivityPoints, getUserTasks } from "entities/task";
import { Fragment, useState } from "react";
import { Button, Modal } from "shared/ui";
import { Header } from "widgets/header";

const currencyIcon: { [key: string]: string } = {
    gold: "🪙",
    gem: "💎",
};

export const TasksPage = () => {
    const client = useQueryClient();

    const { data: balance } = useQuery({
        queryKey: ["balance-key"],
        queryFn: getBalance,
    });
    const { data: userTasks } = useQuery({
        queryKey: ["user-tasks"],
        queryFn: getUserTasks,
    });
    const { data: userActivityRewards } = useQuery({
        queryKey: ["user-activity-reward"],
        queryFn: getUserActivityReward,
    });
    const pointsMutation = useMutation({
        mutationFn: claimUserTaskActivityPoints,
        mutationKey: ["claim-user-task-activity-points"],
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["user-tasks"] });
            client.invalidateQueries({ queryKey: ["balance-key"] });
            client.invalidateQueries({ queryKey: ["user-activity-reward"] });
        },
    });
    const rewardMutation = useMutation({
        mutationFn: claimUserActivityReward,
        mutationKey: ["claim-user-activity-reward"],
        onSuccess: () => {
            client.invalidateQueries({ queryKey: ["user-activity-reward"] });
            setRewardVisible(true);
        },
    });

    const [rewardVisible, setRewardVisible] = useState(false);
    const [selectedReward, setSelectedReward] = useState(0);

    const activityStep = balance ? balance.activityPoints / 100 : 0;

    return (
        <>
            <Header
                slot={
                    <div className="relative flex h-7 items-center rounded-full bg-orange-100 px-3 leading-none font-medium text-orange-700">
                        🎁 {balance?.activityPoints} / 400
                    </div>
                }
            />
            <div
                className="flex flex-col gap-6 px-4 pt-22 pb-22"
                style={{ height: "calc(100vh-128px)" }}
            >
                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">Награды</h1>
                    <div className="relative flex gap-2 overflow-x-auto rounded-xl">
                        {new Array(7).fill(0).map((_, i) => (
                            <div
                                key={i}
                                className={clsx(
                                    "flex aspect-square size-28 flex-col justify-between rounded-xl bg-neutral-300 bg-linear-to-t from-black/10 to-transparent p-2 transition active:scale-[0.98]",
                                )}
                            >
                                <div className=""></div>
                                <div className="rounded-xl bg-green-600 py-1 text-center font-medium text-white">
                                    День {i + 1}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-8">
                    <h1 className="text-xl font-bold">Задания</h1>
                    <div className="mb-6 flex items-center justify-between">
                        {userActivityRewards?.map((r, i) => (
                            <Fragment key={i}>
                                <div className="flex flex-col items-center">
                                    <div
                                        className={clsx(
                                            "relative flex size-10 items-center justify-center rounded-full",
                                            i < activityStep
                                                ? r?.claimed
                                                    ? "border-[3px] border-yellow-500 bg-white"
                                                    : "border border-yellow-600 bg-yellow-400 shadow-[0px_0px_10px] shadow-yellow-500 transition active:bg-yellow-500"
                                                : "border border-neutral-400 bg-neutral-200",
                                        )}
                                        onClick={() => {
                                            console.log(r);
                                            if (r === null || r?.claimed)
                                                return;
                                            rewardMutation.mutate(
                                                (i + 1) * 100,
                                            );
                                            setSelectedReward(i);
                                        }}
                                    >
                                        <span
                                            className={clsx(
                                                "material-symbols-outlined",
                                                i < activityStep
                                                    ? r?.claimed
                                                        ? "text-3xl! font-medium! text-yellow-500"
                                                        : "text-yellow-900"
                                                    : "text-neutral-400",
                                            )}
                                        >
                                            {r?.claimed
                                                ? "done"
                                                : "featured_seasonal_and_gifts"}
                                        </span>
                                        <div
                                            className={clsx(
                                                "absolute -bottom-6 left-1/2 -translate-x-1/2 font-medium",
                                                i < activityStep
                                                    ? r?.claimed
                                                        ? "text-neutral-900"
                                                        : "text-yellow-900"
                                                    : "text-neutral-600",
                                            )}
                                        >
                                            {(i + 1) * 100}
                                        </div>
                                    </div>
                                </div>
                                {i !== 3 && (
                                    <div
                                        className={clsx(
                                            "mx-2 h-[3px] w-full rounded-full",
                                            i < activityStep - 1
                                                ? "bg-yellow-400"
                                                : "bg-neutral-300",
                                        )}
                                    />
                                )}
                            </Fragment>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {userTasks
                            ?.sort(
                                (a, b) =>
                                    Number(b.isCompleted) -
                                    Number(a.isCompleted),
                            )
                            ?.sort(
                                (a, b) =>
                                    Number(a.isClaimed) - Number(b.isClaimed),
                            )
                            .map(task => (
                                <div
                                    key={task.id}
                                    className="relative flex flex-col justify-between rounded-xl border border-neutral-400 bg-white"
                                >
                                    <div className="mt-4 flex w-fit gap-4 rounded-tr-full rounded-br-full bg-neutral-300 px-4 py-1">
                                        Прогресс{" "}
                                        <span className="font-medium">
                                            {task.progress} / {task.goal}
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-4 p-4">
                                        <p>{task.description}</p>
                                        <div className="flex w-full justify-center self-end">
                                            {!task.isClaimed ? (
                                                <button
                                                    disabled={!task.isCompleted}
                                                    className={clsx(
                                                        "flex h-8 w-full items-center justify-center gap-2 rounded-full px-4 leading-none font-medium transition",
                                                        task.isCompleted
                                                            ? "bg-green-600 text-white active:bg-green-700"
                                                            : "bg-neutral-300 text-neutral-600",
                                                    )}
                                                    onClick={() =>
                                                        pointsMutation.mutate(
                                                            task.id,
                                                        )
                                                    }
                                                >
                                                    <span className="material-symbols-outlined fill text-xl!">
                                                        arrow_circle_down
                                                    </span>
                                                    Получить
                                                </button>
                                            ) : (
                                                <p className="font-medium text-green-600">
                                                    Получено
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    {task.isClaimed && (
                                        <div className="absolute top-0 left-0 flex h-full w-full items-center justify-center rounded-xl bg-black/50">
                                            <div className="flex size-10 items-center justify-center rounded-full bg-neutral-200">
                                                <span className="material-symbols-outlined font-bold! text-green-600">
                                                    done
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <Modal open={rewardVisible}>
                <div className="flex flex-col items-center justify-center gap-6 p-4">
                    <h2 className="text-xl font-bold">Награды</h2>
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex size-16 items-center justify-center rounded-xl bg-neutral-300 text-4xl">
                            {userActivityRewards &&
                                userActivityRewards?.length !== 0 &&
                                userActivityRewards[selectedReward] &&
                                userActivityRewards[selectedReward]
                                    .activityReward.reward.currency &&
                                currencyIcon[
                                    userActivityRewards[selectedReward]
                                        .activityReward.reward.currency.name
                                ]}
                        </div>
                        <div className="font-medium">
                            x{" "}
                            {userActivityRewards &&
                                userActivityRewards?.length !== 0 &&
                                userActivityRewards[selectedReward] &&
                                userActivityRewards[selectedReward]
                                    .activityReward.reward.currency &&
                                userActivityRewards[selectedReward]
                                    .activityReward.reward.quantity}
                        </div>
                    </div>
                    <Button
                        className="h-10 w-full rounded-full bg-green-600 px-4 font-medium text-white transition active:bg-green-700"
                        onClick={() => setRewardVisible(false)}
                    >
                        Ок
                    </Button>
                </div>
            </Modal>
        </>
    );
};

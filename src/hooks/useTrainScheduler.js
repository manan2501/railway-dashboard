import { useState, useEffect } from "react";
import { formatTime, parseTime } from "../utils/parsers";

// Main scheduling logic
const useTrainScheduler = (initialSchedule, platformCount) => {
    const [schedule, setSchedule] = useState(initialSchedule);
    const [platforms, setPlatforms] = useState(Array(platformCount).fill(null));
    const [waitingList, setWaitingList] = useState([]);
    const [report, setReport] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    const priorityOrder = { P1: 0, P2: 1, P3: 2 };

    const sortByPriority = (trains) => {
        return trains.sort((a, b) => {
            if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            // If priorities are the same, sort by position in the original list
            return initialSchedule.indexOf(a) - initialSchedule.indexOf(b);
        });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    const getCurrentTimeInMinutes = (date) => {
        return date.getHours() * 60 + date.getMinutes();
    };
    // useEffect(() => {
    //     const timer = setInterval(() => {
    //         setCurrentTime((prevTime) => (prevTime + 1) % (24 * 60));
    //     }, 1000); // Update every second for demo purposes

    //     return () => clearInterval(timer);
    // }, []);

    useEffect(() => {
        const updateSchedule = () => {
            const currentTimeInMinutes = getCurrentTimeInMinutes(currentTime);

            // Handle departures
            const updatedPlatforms = platforms.map((train) => {
                if (
                    train &&
                    parseTime(train.actual_departure_time) <=
                        currentTimeInMinutes
                ) {
                    setReport((prev) => [
                        ...prev,
                        {
                            ...train,
                            actual_departure_time:
                                formatTime(currentTimeInMinutes),
                        },
                    ]);
                    return null;
                }
                return train;
            });
            setPlatforms(updatedPlatforms);

            // Handle arrivals with priority
            let trainsToProcess = [...schedule, ...waitingList].filter(
                (train) => parseTime(train.arrival_time) <= currentTimeInMinutes
            );
            trainsToProcess = sortByPriority(trainsToProcess);

            const updatedSchedule = schedule.filter(
                (train) => parseTime(train.arrival_time) > currentTimeInMinutes
            );

            const newWaitingList = [];

            trainsToProcess.forEach((train) => {
                const freePlatform = updatedPlatforms.findIndex(
                    (p) => p === null
                );
                if (freePlatform !== -1) {
                    const delay = Math.max(
                        0,
                        currentTimeInMinutes - parseTime(train.arrival_time)
                    );
                    const newDepartureTime =
                        parseTime(train.departure_time) + delay;
                    updatedPlatforms[freePlatform] = {
                        ...train,
                        actual_arrival_time: formatTime(currentTimeInMinutes),
                        actual_departure_time: formatTime(newDepartureTime),
                    };
                } else {
                    newWaitingList.push(train);
                }
            });

            setPlatforms(updatedPlatforms);
            setSchedule(updatedSchedule);
            setWaitingList(newWaitingList);
        };

        if (schedule?.length > 0 && platformCount > 0) {
            updateSchedule();
        }
    }, [
        currentTime,
        // schedule,
        // platforms,
        // waitingList,
        platformCount,
        initialSchedule,
    ]);

    useEffect(() => {
        if (initialSchedule.length > 0) {
            const currentTimeInMinutes = getCurrentTimeInMinutes(new Date());
            const filteredSchedule = initialSchedule.filter(
                (train) => parseTime(train.arrival_time) >= currentTimeInMinutes
            );
            setSchedule(filteredSchedule);
            setPlatforms(Array(platformCount).fill(null));
            setWaitingList([]);
            setReport([]);
        }
    }, [initialSchedule]);

    return {
        currentTrains: platforms,
        waitingList,
        report,
        currentTime: formatTime(getCurrentTimeInMinutes(currentTime)),
    };
};

export default useTrainScheduler;

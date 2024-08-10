import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useTrainScheduler from "../hooks/useTrainScheduler";

const TrainStationVisualization = ({ initialSchedule, platformCount }) => {
    const { currentTrains, waitingList, report, currentTime } =
        useTrainScheduler(initialSchedule, platformCount);
    const [animatingTrains, setAnimatingTrains] = useState([]);

    useEffect(() => {
        setAnimatingTrains((prevAnimatingTrains) => {
            return currentTrains.map((train, index) => {
                if (train) {
                    return {
                        ...train,
                        key: `${train.train_number}-${Date.now()}`, // Unique key for each train
                        animationState: prevAnimatingTrains[index]
                            ? "stationary"
                            : "arriving",
                    };
                }
                return null;
            });
        });
    }, [currentTrains]);

    const trainVariants = {
        arriving: { x: "-100%", opacity: 0 },
        stationary: { x: "0%", opacity: 1 },
        departing: { x: "100%", opacity: 0 },
    };

    return (
        <div className="train-station">
            <h1 className="station-title">
                Train Station - Current Time: {currentTime}
            </h1>

            <div className="platforms-container">
                <h2 className="section-title">Platforms</h2>
                <div className="platforms">
                    {Array.from({ length: platformCount }).map((_, index) => (
                        <div
                            key={`platform-${index}`}
                            style={{ width: "100%" }}
                        >
                            <p>Platform {index + 1}</p>
                            <div
                                style={{
                                    width: "100%",
                                    height: "1rem",
                                    backgroundColor: "grey",
                                    position: "relative",
                                }}
                            >
                                <AnimatePresence>
                                    <motion.div
                                        className="train"
                                        variants={trainVariants}
                                        initial="arriving"
                                        animate="stationary"
                                        exit="departing"
                                        transition={{ duration: 1 }}
                                    >
                                        {animatingTrains[index] ? (
                                            <>
                                                Train{" "}
                                                {
                                                    animatingTrains[index]
                                                        .train_number
                                                }
                                                <span className="train-times">
                                                    Arr:{" "}
                                                    {
                                                        animatingTrains[index]
                                                            .actual_arrival_time
                                                    }
                                                    , Dep:{" "}
                                                    {
                                                        animatingTrains[index]
                                                            .actual_departure_time
                                                    }
                                                </span>
                                            </>
                                        ) : (
                                            "No Train"
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="info-container">
                <div className="waiting-list">
                    <h2 className="section-title">Waiting List</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Train Number</th>
                                <th>Priority</th>

                                <th>Arrival</th>

                                <th>Departure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {waitingList.map((train, index) => (
                                <tr key={index}>
                                    <td data-label="Train Number">
                                        {train.train_number}
                                    </td>
                                    <td
                                        data-label="Priority"
                                        className={`priority-${train.priority}`}
                                    >
                                        {train.priority}
                                    </td>
                                    <td data-label="Scheduled Arrival">
                                        {train.arrival_time}
                                    </td>

                                    <td data-label="Scheduled Departure">
                                        {train.departure_time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="report-container">
                    <h2 className="section-title">Train Report</h2>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Train Number</th>
                                <th>Priority</th>
                                <th>Scheduled Arrival</th>
                                <th>Actual Arrival</th>
                                <th>Scheduled Departure</th>
                                <th>Actual Departure</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((train, index) => (
                                <tr key={index}>
                                    <td data-label="Train Number">
                                        {train.train_number}
                                    </td>
                                    <td
                                        data-label="Priority"
                                        className={`priority-${train.priority}`}
                                    >
                                        {train.priority}
                                    </td>
                                    <td data-label="Scheduled Arrival">
                                        {train.arrival_time}
                                    </td>
                                    <td data-label="Actual Arrival">
                                        {train.actual_arrival_time}
                                    </td>
                                    <td data-label="Scheduled Departure">
                                        {train.departure_time}
                                    </td>
                                    <td data-label="Actual Departure">
                                        {train.actual_departure_time}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrainStationVisualization;

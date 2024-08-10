import { useState } from "react";
import CSVReader from "react-csv-reader";
import TrainScheduleVisualization from "./components/TrainScheduleVisualization";
import "./styles/dashboard.css";

function App() {
    const [csvData, setCsvData] = useState([]);
    const [platformInput, setPlatformInput] = useState(2);
    const [initialSchedule, setInitialSchedule] = useState([]);
    const [platformCount, setPlatformCount] = useState(0);

    return (
        <div className="container_main">
            <div className="container_input">
                <div>
                    <p>CSV File</p>
                    <CSVReader
                        parserOptions={{
                            header: true,
                            transformHeader: (header) =>
                                header.toLowerCase().replace(/\W/g, "_"),
                        }}
                        onFileLoaded={(data, fileInfo, originalFile) => {
                            setCsvData(data);
                        }}
                    />
                </div>
                <div>
                    <p>Number of Platforms</p>
                    <input
                        onChange={(e) =>
                            setPlatformInput(Number(e?.target?.value))
                        }
                        value={platformInput}
                    />
                </div>
                <button
                    onClick={() => {
                        setPlatformCount(platformInput);
                        setInitialSchedule(csvData);
                    }}
                >
                    Submit
                </button>
            </div>
            {initialSchedule?.length > 0 ? (
                <TrainScheduleVisualization
                    initialSchedule={initialSchedule}
                    platformCount={platformCount}
                />
            ) : null}
        </div>
    );
}

export default App;

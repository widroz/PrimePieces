import React, { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import Controls from "./Controls";
import Bootstrap from "../Bootstrap";
import NavigationBar from "../navigation/NavigationBar";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: "bottom",
        },
        title: {
            display: false,
            text: "Cut Sizes Chart",
        },
    },
};


export default function CutSizesChart() {

    const [labels, setLabels] = useState([]);
    const [cutsData, setCutsData] = useState();
    const [cutSizes, setCutSizes] = useState([]);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(30);
    const[selector, setSelector] = useState(1);

    function findCuts(min, max, selector) {

        function findCutBruteForce(n) {
    
            function numberOfColumns(n) {
                return (n + 1) / 2
            }
    
            function piecesCut(cutSize) {
                return 2 * cutSize - 1;
            }
    
            if (n <= 2) return 0;
    
            if (n % 2 === 0) return 0;
            else {
                let initialColumns = numberOfColumns(n);
    
                for (let cutSize = 1; cutSize <= initialColumns - 2; cutSize++) {
                    if ((piecesCut(cutSize) % (initialColumns - cutSize) === 0) && (n%selector===0)) return cutSize;
                }
            }
            return 0;
        }
    
        let cuts = [];
        for (let i = min; i <= max; i++) {
            cuts.push(findCutBruteForce(i));
            console.log(findCutBruteForce(i));
        }
        return cuts;
    }
    
    

    function assignNewCutSizes() {
        setCutSizes(findCuts(min, max, selector));
            
        console.log("CUT SIZES" + cutSizes);
    }

    useEffect(() => {
        setLabels([]);
        setLabels(Array.apply(null, {length: max}).map(Number.call, Number))
        console.log("LABELS" + labels);
        assignNewCutSizes()
    }, [min, max,selector]);

    useEffect(() => {
        //set only cutsData.datasets[0].data to the cutSizes array, the rest of cutsData object remains the same
        setCutsData({
            labels,
            datasets: [
                {
                    label: "Cut Sizes",
                    data: cutSizes,
                    borderColor: "rgba(194, 24, 91, 0.7)",
                },
            ],
        }
        );
    }, [cutSizes]);



    return (
        <div>
            <Bootstrap/>
            <NavigationBar/>
            <Controls min={min} max={max} selector={selector} setSelector={setSelector} setMin={setMin} setMax={setMax}/>
            {labels && cutsData && <Line options={options} data={cutsData} />}
        </div>
    );
};


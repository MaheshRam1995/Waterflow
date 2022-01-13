import { useState } from "react";
import Creation from './Creation';
import MainForm from './MainForm';
const Simulation = () => {

    const [step, setStep] = useState(1);
    const [gridData, setGridData] = useState([]);

    /**
     * Navigates to previous pages
     */
    const previousStep = () => {
        setStep(step - 1);
    }

    /**
     * navigates to next pages
     * @param {*} value 
     */
    const nextStep = (value) => {
        setGridData(value)
        setStep(step + 1);
    }

    switch (step) {
        case 1:
            return (<Creation nextStep={nextStep} />)

        default:
            return (<MainForm gridData={gridData} nextStep={nextStep} previousStep={previousStep} />)
    }

}
export default Simulation;
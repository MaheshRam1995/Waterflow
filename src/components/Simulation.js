import { useState } from "react";
import Creation from './Creation';
import MainForm from './MainForm';
const Simulation = () => {

    const [step, setStep] = useState(1);
    const [gridData, setGridData] = useState([]);

    const previousStep = () => {
        setStep(step - 1);
    }

    const nextStep = (value) => {
        setGridData(value)
        setStep(step + 1);
    }

    const reloadSimulation = () => {
       window.location.reload(false);
    }

    switch (step) {
        case 1:
            return (<><Creation nextStep={nextStep} /></>)

        default:
            return (<><MainForm reloadSimulation={reloadSimulation} gridData={gridData} nextStep={nextStep} previousStep={previousStep} /></>)
    }

}
export default Simulation;
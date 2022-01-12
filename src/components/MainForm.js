import '../css/App.css';
import {  useState } from 'react';
import { Button } from 'antd';
const MainForm = (props) => {

    const [enableStart, setEnableStart] = useState(false);
    const [startSimulation, setStartSimulation] = useState(false);
    const [flowStart, setFlowStart] = useState(false);
    const [resetFlows, setResetFlows] = useState(false);
    const [noOfBlocks] = useState(props.gridData.noOfBlocks);
    const [noOfColumns] = useState(props.gridData.noOfColumns);
    const [noOfRows] = useState(props.gridData.noOfRows);

    const setAllState = () => {
        setEnableStart(false);
        setResetFlows(true);
        setFlowStart(false);
        setStartSimulation(false);
        const filledBlocks  = document.getElementsByClassName('fill_color');
        if(filledBlocks && filledBlocks.length> 0){
            [...filledBlocks].forEach(element => {
                element.removeAttribute('class');
                element.setAttribute('class','simulator');
            });
        }
        const filledBlockss  = document.getElementsByClassName('blocks');
        if(filledBlockss && filledBlockss.length> 0){
            [...filledBlockss].forEach(element => {
                if(element.parentElement && element.parentElement.className === 'rowss'){
                    element.removeAttribute('class');
                    element.setAttribute('class','simulator');
                    element.removeAttribute('id');
                    element.removeAttribute('draggable');
                    element.addEventListener('drop',  (event) => {
                        drop(event);
                    })
                    element.addEventListener('dragover',  (event) => {
                        allowDrop(event);
                    })
                }
            });
        }

        const rps  = document.getElementsByClassName('replaced_block');
        if(rps && rps.length> 0){
            [...rps].forEach(element => {
                    element.removeAttribute('class');
                    element.setAttribute('class','blocks');
                    element.addEventListener('dragstart',  (event) => {
                        drag(event);
                    })
                    element.setAttribute('draggable','true');
                    element.setAttribute('id',`drag${Math.random()}`);
                
            });
        }
        
    
    }


    function allowDrop(ev) {
        ev.preventDefault();
    }

    function drag(ev) {
        ev.dataTransfer.setData("text", ev.target.id);
    }

    function drop(ev) {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("text");
        var parent = ev.target.parentElement;
        var child = ev.target;
        var s = document.getElementById(data);
        if (s && document.getElementsByClassName('beginSimulation')[0] && !document.getElementsByClassName('beginSimulation')[0].disabled) {
            var sParent = s.parentElement;
            var s1 = s.cloneNode();
            parent.replaceChild(s1, child);
            let row_2 = document.createElement('td');
            row_2.setAttribute('class', 'replaced_block');
            sParent.replaceChild(row_2, s);
        }
    }

    const onStartSelect = (column) => {
        setFlowStart(true);
        const row = 0;
        callStart(row, column);
        findFlowBlocks(column);
        setStartSimulation(true);
        setResetFlows(false);
    }



    const findFlowBlocks = (column) => {
        let itertor = 0;
        let sim_start = document.getElementsByClassName('start_block')[0];
        while (itertor < noOfColumns) {
            if (itertor !== column) {
                sim_start.rows[0].cells[itertor].className = 'fill_no_color'
            }
            itertor++;
        }
        let tables = document.getElementsByClassName('simulator_border')[0];
        let res = [];
        itertor = 0;
        while (itertor < noOfColumns) {
            if (tables.rows[noOfRows - 1].cells[itertor].className === 'fill_color') {
                res.push(itertor);
            }
            itertor++;
        }
        itertor = 0;
        let flow = document.getElementsByClassName('flow_color')[0];
        while (itertor < noOfColumns) {
            if (res.includes(itertor)) {
                flow.rows[0].cells[itertor].className = 'fill_color'
            } else {
                flow.rows[0].cells[itertor].className = 'fill_no_color';
            }
            itertor++;
        }
    }

    const callStart = (row, column) => {
        let tables = document.getElementsByClassName('simulator_border')[0];
        if ((row < noOfRows && tables.rows[row].cells[column].className === 'simulator')) {
            tables.rows[row].cells[column].className = 'fill_color';
            callStart(row + 1, column);
        } else if (row < noOfRows && tables.rows[row].cells[column].className === 'blocks') {
            if (row - 1 > -1) {
                callStart(row - 1, column);
            }
            if (column - 1 > -1 && row - 1 > -1) {
                callStart(row - 1, column - 1);
            }
            if (column + 1 < noOfColumns && row - 1 > -1) {
                callStart(row - 1, column + 1);
            }
        } 
    }

    const startSimulating = () => {
        setStartSimulation(true);
        setEnableStart(true);
    }
    return (<>


        <div class="container_simulation">
            <h2 style={{ textAlign: 'center' }}>Waterflow Simulator</h2>
            <div style={{ display: 'flex', justifyContent:'center' }}>
                <div style={{textAlign:'center'}}>
                   {enableStart ? <div>Start Point</div>:<></>}
                   {enableStart ?    <table className='start_block' style={{ borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>

                                {[...Array(noOfColumns)].map((e, i) => {
                                    return <td className='sim_start' onClick={() => { onStartSelect(i) }}></td>


                                })}
                            </tr>
                        </tbody>
                    </table> 
                    :<></>}
                    <table className='simulator_border'>
                        <tbody>
                            {[...Array(noOfRows)].map((e, i) => {
                                return <tr className='rowss'>
                                    {[...Array(noOfColumns)].map((e, i) => {
                                        return <td className='simulator' onDrop={(event) => drop(event)} onDragOver={(event) => allowDrop(event)} ></td>
                                    })}
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <table className='flow_color' style={{ display: flowStart ? 'block' : 'none' }}>
                        <tbody>
                            <tr>
                                {[...Array(noOfColumns)].map((e, i) => {
                                    return <td className='simulator' ></td>
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{  paddingLeft:'15px', textAlign:'center' }}>
                    <div>Blocks</div>
                    <table style={{borderCollapse:'unset'}} cellspacing="15px">
                        <tbody>
                            <tr>
                                {[...Array(noOfBlocks)].map((e, i) => {
                                     return  i%3 === 0 ? <td className='blocks' draggable="true" onDragStart={(event) => drag(event)} id={`drag${i}`}></td>
                                     : <></>
                                })}
                            </tr>
                            <tr>
                                {[...Array(noOfBlocks)].map((e, i) => {
                                     return  i%3 === 1? <td className='blocks' draggable="true" onDragStart={(event) => drag(event)} id={`drag${i}`}></td>
                                     : <></>
                                })}
                            </tr>
                            <tr>
                                {[...Array(noOfBlocks)].map((e, i) => {
                                     return  i%3 === 2 ? <td className='blocks' draggable="true" onDragStart={(event) => drag(event)} id={`drag${i}`}></td>
                                     : <></>
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
            <Button onClick ={()=> props.previousStep({noOfRows, noOfColumns, noOfBlocks})}type="primary">Previous</Button>
            <Button  disabled={resetFlows} style={{float:'right', marginLeft:'8px'}} onClick ={()=> setAllState()}type="primary">Reset</Button>
            <Button className='beginSimulation' disabled={startSimulation} style={{float:'right'}} onClick ={()=> startSimulating()}type="primary">Start Simulation</Button>
           
            </div>
        </div>


    </>)
}

export default MainForm;
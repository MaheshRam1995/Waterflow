import '../css/App.css';
import { useState } from 'react';
import { Button } from 'antd';
import Constant from './../constants/Constant';

const MainForm = (props) => {

    const [enableStart, setEnableStart] = useState(false);
    const [startSimulation, setStartSimulation] = useState(false);
    const [flowStart, setFlowStart] = useState(false);
    const [resetFlows, setResetFlows] = useState(false);
    const [noOfBlocks] = useState(props.gridData.noOfBlocks);
    const [noOfColumns] = useState(props.gridData.noOfColumns);
    const [noOfRows] = useState(props.gridData.noOfRows);

    /**
     * setAllState reverts back all components to its origin state
     */
    const setAllState = () => {
        setEnableStart(false);
        setResetFlows(true);
        setFlowStart(false);
        setStartSimulation(false);
        const filledBlocks = document.getElementsByClassName('fill_color');
        if (filledBlocks && filledBlocks.length > 0) {
            [...filledBlocks].forEach(element => {
                element.removeAttribute('class');
                element.setAttribute('class', 'simulator');
            });
        }

        const filledBlockss = document.getElementsByClassName('blocks');
        if (filledBlockss && filledBlockss.length > 0) {
            [...filledBlockss].forEach(element => {
                if (element.parentElement && element.parentElement.className === 'rowss') {
                    element.removeAttribute('class');
                    element.setAttribute('class', 'simulator');
                    element.removeAttribute('id');
                    element.removeAttribute('draggable');
                    element.addEventListener('drop', (event) => {
                        drop(event);
                    })
                    element.addEventListener('dragover', (event) => {
                        allowDrop(event);
                    })
                }
            });
        }

        const replaceBlock = document.getElementsByClassName('replaced_block');
        if (replaceBlock && replaceBlock.length > 0) {
            [...replaceBlock].forEach(element => {
                element.removeAttribute('class');
                element.setAttribute('class', 'blocks');
                element.addEventListener('dragstart', (event) => {
                    drag(event);
                })
                element.setAttribute('draggable', 'true');
                element.setAttribute('id', `drag${Math.random()}`);
            });
        }
    }


    /**
     * allowDrop prevents default events when blocks are dropped to the simulator
     * @param {*} event 
     */
    function allowDrop(event) {
        event.preventDefault();
    }

    /**
     * drag event handles dragging blocks for the simulator
     * @param {*} event 
     */
    function drag(event) {
        event.dataTransfer.setData("text", event.target.id);
    }

    /**
     * drop event handles dropping blocks to the simulator
     * @param {*} event 
     */
    function drop(event) {
        event.preventDefault();
        var data = event.dataTransfer.getData("text");
        var parent = event.target.parentElement;
        var child = event.target;
        var draggedElement = document.getElementById(data);
        if (draggedElement && document.getElementsByClassName('beginSimulation')[0] && !document.getElementsByClassName('beginSimulation')[0].disabled) {
            var draggedElementParent = draggedElement.parentElement;
            var dropElement = draggedElement.cloneNode();
            parent.replaceChild(dropElement, child);
            let creationColumn = document.createElement('td');
            creationColumn.setAttribute('class', 'replaced_block');
            draggedElementParent.replaceChild(creationColumn, draggedElement);
        }
    }

    /**
     * onStartSelect generates start point for simulation process
     * @param {*} column 
     */
    const onStartSelect = (column) => {

        const row = 0;

        setFlowStart(true);
        simulateFlow(row, column);
        findFlowBlocks(column);
        setStartSimulation(true);
        setResetFlows(false);
    }


   /**
    * findFlowBlocks hides all blocks except waterflow start point block
    * @param {*} column 
    */
    const findFlowBlocks = (column) => {
        let itertor = 0;
        let sim_start = document.getElementsByClassName('start_block')[0];
        while (itertor < noOfColumns) {
            if (itertor !== column) {
                sim_start.rows[0].cells[itertor].className = 'fill_no_color';
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

    /**
     * simulateFlow generates waterflow simulation through the blocks
     * @param {*} row 
     * @param {*} column 
     */
    const simulateFlow = (row, column) => {
        let tables = document.getElementsByClassName('simulator_border')[0];
        if ((row < noOfRows && tables.rows[row].cells[column].className === 'simulator')) {
            tables.rows[row].cells[column].className = 'fill_color';
            simulateFlow(row + 1, column);
        } else if (row < noOfRows && tables.rows[row].cells[column].className === 'blocks') {
            if (row - 1 > -1) {
                simulateFlow(row - 1, column);
            }
            if (column - 1 > -1 && row - 1 > -1) {
                simulateFlow(row - 1, column - 1);
            }
            if (column + 1 < noOfColumns && row - 1 > -1) {
                simulateFlow(row - 1, column + 1);
            }
        }
    }

    /**
     * startSimulating enables start point blocks for simulation
     */
    const startSimulating = () => {
        setStartSimulation(true);
        setEnableStart(true);
    }

    return (<>
        <div class="container_simulation">
            <h2 style={{ textAlign: 'center' }}>{Constant.PROJECT_TITLE}</h2>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    {enableStart ? <div>{Constant.START}</div> : <></>}
                    {enableStart ? <table className='start_block' style={{ borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                {[...Array(noOfColumns)].map((e, i) => {
                                    return <td className='sim_start' onClick={() => { onStartSelect(i) }}></td>
                                })}
                            </tr>
                        </tbody>
                    </table>
                        : <></>}
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
                <div style={{ paddingLeft: '15px', textAlign: 'center' }}>
                    <div>{Constant.BLOCKS}</div>
                    <table style={{ borderCollapse: 'unset' }} cellspacing="15px">
                        <tbody>
                            <tr>
                                {[...Array(noOfBlocks)].map((e, i) => {
                                    return i % 3 === 0 ? <td className='blocks' draggable="true" onDragStart={(event) => drag(event)} id={`drag${i}`}></td>
                                        : <></>
                                })}
                            </tr>
                            <tr>
                                {[...Array(noOfBlocks)].map((e, i) => {
                                    return i % 3 === 1 ? <td className='blocks' draggable="true" onDragStart={(event) => drag(event)} id={`drag${i}`}></td>
                                        : <></>
                                })}
                            </tr>
                            <tr>
                                {[...Array(noOfBlocks)].map((e, i) => {
                                    return i % 3 === 2 ? <td className='blocks' draggable="true" onDragStart={(event) => drag(event)} id={`drag${i}`}></td>
                                        : <></>
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <Button onClick={() => props.previousStep({ noOfRows, noOfColumns, noOfBlocks })} type="primary">{Constant.PREVIOUS}</Button>
                <Button disabled={resetFlows} style={{ float: 'right', marginLeft: '8px' }} onClick={() => setAllState()} type="primary">{Constant.RESET}</Button>
                <Button className='beginSimulation' disabled={startSimulation} style={{ float: 'right' }} onClick={() => startSimulating()} type="primary">{Constant.SIMULATION_START}</Button>
            </div>
        </div>


    </>)
}

export default MainForm;
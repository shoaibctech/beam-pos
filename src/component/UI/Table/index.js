import React from "react";
import './styles.css';

const Table = ({key, key1, key2, key3, key4, key5, val, val1, val2, val3, val4, val5}) => {
    return (
        <div>
            <table id="customers">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Value</th>
                </tr>
                </thead>
                {/*{ !!key &&*/}
                {/*    <tr>*/}
                {/*        <td>{key}</td>*/}
                {/*        <td>{val}</td>*/}
                {/*    </tr>*/}
                {/*}*/}
                <tbody>
                <tr>
                    <td>{key1}</td>
                    <td>{val1}</td>
                </tr>
                <tr>
                    <td>{key2}</td>
                    <td>{val2}</td>
                </tr>
                <tr>
                    <td>{key3}</td>
                    <td>{val3}</td>
                </tr>
                <tr>
                    <td>{key4}</td>
                    <td>{val4}</td>
                </tr>
                <tr>
                    <td>{key5}</td>
                    <td>{val5}</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Table;
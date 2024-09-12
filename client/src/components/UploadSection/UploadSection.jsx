import React, { useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DragNDropUpload from '../DragNDropUpload/DragNDropUpload';

const formats = [
    { label: 'JPEG/JPG', value: 'jpeg' },
    { label: 'PNG', value: 'png' },
    { label: 'PDF', value: 'pdf' },
];

const UploadSection = () => {
    const [fromFormat, setFromFormat] = useState(null);
    const [toFormat, setToFormat] = useState(null);

    return (
        <div className="container text-center my-5">
            <div className="row justify-content-center">
                <div className="col-md-3">
                    <Autocomplete
                        value={fromFormat}
                        onChange={(event, newValue) => setFromFormat(newValue)}
                        options={formats}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => <TextField {...params} label="From Format" />}
                    />
                </div>

                <div className="col-md-3">
                    <Autocomplete
                        value={toFormat}
                        onChange={(event, newValue) => setToFormat(newValue)}
                        options={formats}
                        getOptionLabel={(option) => option.label}
                        renderInput={(params) => <TextField {...params} label="To Format" />}
                    />
                </div>
            </div>

            <div className="row justify-content-center my-3">
                <DragNDropUpload fromFormat={fromFormat ? fromFormat.value : ''} toFormat={toFormat ? toFormat.value : ''} />
            </div>
        </div>
    );
};

export default UploadSection;

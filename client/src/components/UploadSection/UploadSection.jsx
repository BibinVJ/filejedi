import React, { useState } from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import DragNDropUpload from '../DragNDropUpload/DragNDropUpload';

const UploadSection = () => {
    const [fromFormat, setFromFormat] = useState('');
    const [toFormat, setToFormat] = useState('');
    const [convertedFile, setConvertedFile] = useState(null);

    const handleFromFormatChange = (event) => {
        setFromFormat(event.target.value);
    };

    const handleToFormatChange = (event) => {
        setToFormat(event.target.value);
    };

    return (
        <div className="container text-center my-5">
            <div className="row justify-content-center">
                <div className="col-md-3">
                    <FormControl fullWidth>
                        <InputLabel id="from-format-label">From Format</InputLabel>
                        <Select
                            labelId="from-format-label"
                            id="from-format"
                            value={fromFormat}
                            label="From Format"
                            onChange={handleFromFormatChange}
                        >
                            <MenuItem value={'jpeg'}>JPEG/JPG</MenuItem>
                            <MenuItem value={'png'}>PNG</MenuItem>
                            <MenuItem value={'pdf'}>PDF</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                <div className="col-md-3">
                    <FormControl fullWidth>
                        <InputLabel id="to-format-label">To Format</InputLabel>
                        <Select
                            labelId="to-format-label"
                            id="to-format"
                            value={toFormat}
                            label="To Format"
                            onChange={handleToFormatChange}
                        >
                            <MenuItem value={'jpeg'}>JPEG/JPG</MenuItem>
                            <MenuItem value={'png'}>PNG</MenuItem>
                            <MenuItem value={'pdf'}>PDF</MenuItem>
                        </Select>
                    </FormControl>
                </div>
            </div>

            <div className="row justify-content-center my-3">
                <DragNDropUpload fromFormat={fromFormat} toFormat={toFormat} />
            </div>

            {convertedFile && (
                <div>
                    <a href={convertedFile} download>
                        <button>Download</button>
                    </a>
                </div>
            )}
        </div>
    );
};

export default UploadSection;

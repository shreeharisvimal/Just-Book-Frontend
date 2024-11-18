import React, { useState, useEffect } from 'react';
import axios from '../Admin_axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationComponent = ({setHandleFilterReset, apiLink, stateUpdateFunction, setFixedlen}) => {
    const [previousLink, setPreviousLink] = useState('');
    const [nextLink, setNextLink] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);

    const fetchData = async (api) => {
        try {
            const response = await axios.get(api);
            const { results, previous, next, count } = response.data;

            stateUpdateFunction(results);
            setFixedlen(results.length);
            setPreviousLink(previous);
            setNextLink(next);

            if (count) {
                const total = Math.ceil(count / 4); 
                setTotalPages(total);
            }

            if (api.includes('page=')) {
                const pageMatch = api.match(/page=(\d+)/);
                setCurrentPage(pageMatch ? parseInt(pageMatch[1], 10) : 1);
            } else {
                setCurrentPage(1);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(apiLink);
    }, [apiLink]);

    const handleNextPage = () => {
        if (nextLink) {
            setHandleFilterReset();
            fetchData(nextLink);
        }
            
    };

    const handlePrevPage = () => {
        if (previousLink) {
            setHandleFilterReset();
            fetchData(previousLink);
        }
    };

    const buttonStyle = {
        padding: '0.75rem',
        borderRadius: '0.375rem',
        border: '1px solid #d1d5db',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.875rem',
        backgroundColor: '#f9fafb',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
    };

    const buttonDisabledStyle = {
        ...buttonStyle,
        opacity: 0.5,
        cursor: 'not-allowed',
    };

    const hoverStyle = {
        '&:hover': {
            backgroundColor: '#f3f4f6',
            transform: 'scale(1.05)',
        },
    };

    return (
        <div
            className="flex items-center justify-between my-4"
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                gap: '1rem',
            }}
        >
            <button
                onClick={handlePrevPage}
                disabled={!previousLink}
                style={previousLink ? { ...buttonStyle, ...hoverStyle } : buttonDisabledStyle}
            >
                <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <div style={{ fontSize: '0.875rem', fontWeight: 'bold' }}>
                Page {currentPage} {totalPages && `of ${totalPages}`}
            </div>
            <button
                onClick={handleNextPage}
                disabled={!nextLink}
                style={nextLink ? { ...buttonStyle, ...hoverStyle } : buttonDisabledStyle}
            >
                Next <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

export default PaginationComponent;

import React from 'react';
import Masonry from 'react-masonry-css';

const MasonryGrid = ({ children }) => {
    const breakpointColumns = {
        default: 5,
        1400: 4,
        1024: 3,
        768: 2,
        480: 1,
    };

    return (
        <Masonry
            breakpointCols={breakpointColumns}
            className="masonry-grid"
            columnClassName="masonry-grid-column"
        >
            {children}
        </Masonry>
    );
};

export default MasonryGrid;

import * as React from 'react';
import List from '../list/container';

export interface Props {
}

const Lists: React.FC<any> = () => {
    return (
    <div className="lists">
        <List />
    </div>
    );
}
export default Lists

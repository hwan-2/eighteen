// SearchComponent.js
import { useState } from 'react';
import { searchApiWithName, searchApiWithSinger } from 'pages/api/api.js';

//임시 컴포넌트로 실제 페이지가 만들어지면 사용안할수 있음
const SearchComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedSearchMethod, setSelectedSearchMethod] = useState('searchApiWithName'); // 기본값은 name api

    const handleSearch = async () => {
        try {
            let results;
            if (selectedSearchMethod === 'searchApiWithName') {
                results = await searchApiWithName(searchTerm);
            } else if (selectedSearchMethod === 'searchApiWithSinger') {
                results = await searchApiWithSinger(searchTerm);
            }
            setSearchResults(results);
        } catch (error) {
            console.error('검색 오류:', error);
        }
    };

    return (
        <div>
            <select value={selectedSearchMethod} onChange={(e) => setSelectedSearchMethod(e.target.value)}>
                <option value="searchApiWithName">이름</option>
                <option value="searchApiWithSinger">가수</option>
            </select>

            <ul>
                {searchResults.map((result, index) => (
                    <li key={index}>{result.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default SearchComponent;
import { useState } from 'react';
import { PostFilter } from './components/PostFilter';


const [authorFilter, setAuthorFilter] = useState('');
const [tagFilter, setTagFilter] = useState('');


<div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
  <PostFilter field="author" value={authorFilter} onChange={setAuthorFilter} />
  <PostFilter field="tag" value={tagFilter} onChange={setTagFilter} />
</div>
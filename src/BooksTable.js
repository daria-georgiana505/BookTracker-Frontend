import { useState, useMemo, useEffect } from 'react';
import { Table, Modal, FloatButton } from "antd";
import { PlusCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Link, useNavigate } from "react-router-dom";
import React, { useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { Tag, Alert } from "antd";
import { useAuth } from './AuthContext';
import { Pie } from '@ant-design/plots';

const { confirm } = Modal;

export default function BooksTable() {
  const [dataSource, setDataSource] = useState([]);
  const [minNrPages, setMinNrPages] = useState(0);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!navigator.onLine) {
          throw new Error('No internet connection. Please check your internet connection.');
        }

        const response = await fetch('http://localhost:8080/all', { method: 'GET', headers: {Authorization: `Bearer ${token}`} });

        if (response.status === 403) {
          throw new Error('You don\'t have access to this resource');
        }

        if (!response.ok) {
          throw new Error('Failed to get the list of books');
        }

        const data = await response.json();
        setDataSource(data);
      } catch (error) {
        if (error.message === 'You don\'t have access to this resource') {
          setError(error.message);
      } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
          setError('Failed to fetch data from the server. The server might be down.');
        } else {
          setError(error.message);
        }
      }
    };

    fetchData();
  }, []);

  useMemo(() => {
    const minPages = Math.min(...dataSource.map(book => book.nr_pages));
    setMinNrPages(minPages);
  }, [dataSource]);

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this book?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      async onOk() {
        try {
          if (!navigator.onLine) {
            throw new Error('No internet connection. Please check your internet connection.');
          }

          const response = await fetch(`http://localhost:8080/delete/${id}`, { method: 'DELETE', headers: {Authorization: `Bearer ${token}`} });

          if (response.status === 403) {
            throw new Error('You don\'t have access to this resource');
          }

          if (!response.ok) {
            throw new Error('Failed to delete the book');
          }

          const newData = dataSource.filter(book => book.id !== id);
          setDataSource(newData);
        } catch (error) {
          if (error.message === 'You don\'t have access to this resource') {
            setError(error.message);
        } else if (error instanceof TypeError && error.message === 'Failed to fetch') {
            setError('Failed to fetch data from the server. The server might be down.');
          } else {
            setError(error.message);
          }
        }
      },
    });
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible){
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const genreOptions = useMemo(() => {
    const genres = new Set(dataSource.map(item => item.genre));
    return Array.from(genres).map(genre => ({
      text: genre,
      value: genre,
    }));
  }, [dataSource]);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      ...getColumnSearchProps('title'),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
      sorter: (a, b) => a.author.localeCompare(b.author),
      ...getColumnSearchProps('author'),
    },
    {
      title: 'Genre',
      dataIndex: 'genre',
      key: 'genre',
      sorter: (a, b) => a.genre.localeCompare(b.genre),
      filters: genreOptions,
      onFilter: (value, record) => record.genre === value,
    },
    {
      title: 'Number of pages',
      dataIndex: 'nr_pages',
      key: 'nr_pages',
      sorter: (a, b) => a.nr_pages - b.nr_pages,
      render: (text) => <span>{text}</span>,
    },
    {
      title: '',
      key: 'details',
      render: (text, record) => (
        <Link to={`/details/${record.id}`}>DETAILS</Link>
      ),
    },
    {
      title: '',
      key: 'update',
      render: (text, record) => (
        <Link to={`/update/${record.id}`}>UPDATE</Link>
      ),
    },
    {
      title: '',
      key: 'delete',
      render: (text, record) => (
        <a onClick={() => handleDelete(record.id)}>DELETE</a>
      ),
    },
  ];

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    pageSizeOptions: ['5', '10', '20', '50', '100'],
    showSizeChanger: true,
  });

  const handlePaginationChange = (current, pageSize) => {
    setPagination({
      ...pagination,
      current,
      pageSize,
    });
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/authentication/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        throw new Error('You don\'t have access to this resource');
      }
  
      if (!response.ok) {
        throw new Error('Failed to logout');
      }
  
      logout();
      navigate('/register');
    } catch (error) {
    }
  };
  

  

  let newDataForChart = dataSource.reduce((acc, curr) => {
    let item = acc.find(item => item.genre === curr.genre);

    if (item) {
      item.total += 1;
    } else {
      acc.push({ genre: curr.genre, total: 1 });
    }
  
    return acc;
  }, []
  );


  const config = {  
    data: newDataForChart,
    angleField: 'total',
    colorField: 'genre',
    label: {
      text: 'total',
      content: ({ total }) => `${total}`,
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
    tooltip: false,
  }


  return (
    <div>
      <header>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            closable
            onClose={() => setError(null)}
          />
        )}
        <div style={{ textAlign: 'left'}}>
          <Button type="primary" onClick={handleLogout}>Logout</Button>
        </div>
        <h2>Books</h2>
        <div style={{ position: 'relative' }}>
          <Link to="/add">
            <FloatButton icon={<PlusCircleOutlined />} description="ADD" style={{ position: 'absolute', top: 10, right: 5}} />
          </Link>
        </div>
      </header>
      <body>
        <Tag>Minimum Number of Pages: {minNrPages}</Tag>
        <p></p>
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={{
            ...pagination,
            onChange: handlePaginationChange,
          }}
        />
        <p></p>
        <Pie {...config} />
      </body>
    </div>
  );
}

import { Table, notification, Image } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import EditButton from "components/EditButton";
import HeaderArea from "components/HeaderArea";
import PageHeader from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./ListPage.styles";

import DefaultCourseImage from "assets/images/default-course.png";

const columns = [
  {
    title: "Cover",
    dataIndex: "cover",
    key: "cover",
    render: (_, record) => {
      return (
        <Image
          width={100}
          height={100}
          src={
            record.cover
              ? `${process.env.REACT_APP_API_URL}${record.cover}`
              : DefaultCourseImage
          }
        />
      );
    },
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: "40%",
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
  },
];

const ListPage = () => {
  const history = useHistory();
  const { get, post, loading, response = { data: [], total: 0 } } = useRequest(
    {}
  );

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const pageQuery = `limit=${10 * page}&skip=${10 * page - 10}`;
    const searchQuery = query ? `&search=${query}` : "";
    get(`/courses?${pageQuery}${searchQuery}`);
  }, [get, page, query]);

  const handleDeleteCourse = useCallback(async () => {
    await post("/remove_courses", { selectedIds });
    notification.success({
      message: "Delete course successfully",
      placement: "topRight",
    });
    setSelectedIds([]);
    setPage(1);
  }, [post, selectedIds]);

  return (
    <Wrapper>
      {useMemo(
        () => (
          <PageHeader title="List course" onBack={null} />
        ),
        []
      )}

      {useMemo(
        () => (
          <HeaderArea
            newPath="/admin/courses/new"
            searchPlaceHolder="Search course by name"
            selectedIds={selectedIds}
            onDelete={handleDeleteCourse}
            onSearch={(text) => setQuery(text)}
          />
        ),
        [handleDeleteCourse, selectedIds]
      )}

      {useMemo(
        () => (
          <Table
            rowSelection={{
              type: "checkbox",
              onChange: (data) => setSelectedIds(data),
              selectedRowKeys: selectedIds,
            }}
            columns={columns}
            dataSource={
              response.code
                ? []
                : response.data.map((item) => ({
                    ...item,
                    category: item.category.name,
                    description: (
                      <p className="description-column">{item.description}</p>
                    ),
                    key: item._id,
                    action: (
                      <EditButton
                        onClick={() =>
                          history.push(`/admin/courses/${item._id}/edit`)
                        }
                      />
                    ),
                  }))
            }
            pagination={{
              onChange: (page) => setPage(page),
              pageSize: 10,
              total: response.total,
              current: page,
            }}
            loading={loading}
          />
        ),
        [
          history,
          loading,
          page,
          response.code,
          response.data,
          response.total,
          selectedIds,
        ]
      )}
    </Wrapper>
  );
};

export default ListPage;

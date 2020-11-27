import { Table, Rate, notification } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";

import DeleteButton from "components/DeleteButton";
import HeaderArea from "components/HeaderArea";
import PageHeader from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./ListPage.styles";

const columns = [
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    render: (_, record) => {
      return record.user && record.user.username;
    },
  },
  {
    title: "Course",
    dataIndex: "course",
    key: "course",
    render: (_, record) => {
      return record.course && record.course.name;
    },
  },
  {
    title: "Rate",
    dataIndex: "rate",
    key: "rate",
    render: (_, record) => {
      return <Rate disabled allowHalf value={record.rate} />;
    },
  },
  {
    title: "Content",
    dataIndex: "content",
    key: "content",
    width: "50%",
    render: (_, record) => {
      return <p className="content-column">{record.content}</p>;
    },
  },
];

const ListPage = () => {
  const { get, post, loading, response = { data: [], total: 0 } } = useRequest(
    {}
  );

  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const pageQuery = `limit=${10 * page}&skip=${10 * page - 10}`;
    const searchQuery = query ? `&search=${query}` : "";
    get(`/reviews?${pageQuery}${searchQuery}`);
  }, [get, page, query]);

  const handleDeleteReview = useCallback(async () => {
    await post("/remove_reviews", { selectedIds });
    notification.success({
      message: "Delete review successfully",
      placement: "topRight",
    });
    setSelectedIds([]);
    setPage(1);
  }, [post, selectedIds]);

  return (
    <Wrapper>
      {useMemo(
        () => (
          <PageHeader title="List review" onBack={null} />
        ),
        []
      )}

      {useMemo(
        () => (
          <HeaderArea
            selectedIds={selectedIds}
            onDelete={null}
            searchPlaceHolder="Search review by content"
            onSearch={(data) => setQuery(data)}
            customButtonArea={
              <div className="button-area">
                <DeleteButton
                  disabled={!selectedIds.length}
                  onClick={handleDeleteReview}
                />
              </div>
            }
          />
        ),
        [handleDeleteReview, selectedIds]
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
                    key: item._id,
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

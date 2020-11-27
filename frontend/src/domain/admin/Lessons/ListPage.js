import { Table, notification } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";

import HeaderArea from "components/HeaderArea";
import EditButton from "components/EditButton";
import PageHeader from "components/PageHeader";
import useRequest from "hooks/useRequest";
import Wrapper from "./ListPage.styles";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
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
    title: "Is Finish",
    dataIndex: "isFinish",
    key: "isFinish",
    render: (_, record) => {
      return record.isFinish ? "Finished" : "Not yet";
    },
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
    get(`/lessons?${pageQuery}${searchQuery}`);
  }, [get, page, query]);

  const handleDeleteLesson = useCallback(async () => {
    await post("/remove_lessons", { selectedIds });
    notification.success({
      message: "Delete lesson successfully",
      placement: "topRight",
    });
    setSelectedIds([]);
    setPage(1);
  }, [post, selectedIds]);

  return (
    <Wrapper>
      {useMemo(
        () => (
          <PageHeader title="List lesson" onBack={null} />
        ),
        []
      )}

      {useMemo(
        () => (
          <HeaderArea
            searchPlaceHolder="Search lesson by name"
            newPath="/admin/lessons/new"
            selectedIds={selectedIds}
            onDelete={handleDeleteLesson}
            onSearch={(data) => setQuery(data)}
          />
        ),
        [handleDeleteLesson, selectedIds]
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
                    action: (
                      <EditButton
                        onClick={() =>
                          history.push(`/admin/lessons/${item._id}/edit`)
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

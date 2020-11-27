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
    title: "Is finish",
    dataIndex: "isFinish",
    key: "isFinish",
    render: (_, record) => {
      return record.isFinish ? "Finshed" : "Not yet";
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
    get(`/exams?${pageQuery}${searchQuery}`);
  }, [get, page, query]);

  const handleDeleteExam = useCallback(async () => {
    await post("/remove_exams", { selectedIds });
    notification.success({
      message: "Delete exam successfully",
      placement: "topRight",
    });
    setSelectedIds([]);
    setPage(1);
  }, [post, selectedIds]);

  return (
    <Wrapper>
      {useMemo(
        () => (
          <PageHeader title="List exam" onBack={null} />
        ),
        []
      )}

      {useMemo(
        () => (
          <HeaderArea
            searchPlaceHolder="Search exam by name"
            newPath="/admin/exams/new"
            selectedIds={selectedIds}
            onDelete={handleDeleteExam}
            onSearch={(data) => setQuery(data)}
          />
        ),
        [handleDeleteExam, selectedIds]
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
                          history.push(`/admin/exams/${item._id}/edit`)
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

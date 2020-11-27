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
    title: "User Name",
    dataIndex: "username",
    key: "username",
  },
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (_, record) => {
      return record.role ? "User" : "Admin";
    },
  },
  {
    title: "Birthday",
    dataIndex: "dob",
    key: "dob",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
    render: (_, record) => {
      return record.gender === 0
        ? "Male"
        : record.gender === 1
        ? "Female"
        : "Other";
    },
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
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
    get(`/users?${pageQuery}${searchQuery}`);
  }, [get, page, query]);

  const handleDeleteUser = useCallback(async () => {
    await post("/remove_users", { selectedIds });
    notification.success({
      message: "Delete user successfully",
      placement: "topRight",
    });
    setSelectedIds([]);
    setPage(1);
  }, [post, selectedIds]);

  return (
    <Wrapper>
      {useMemo(
        () => (
          <PageHeader title="List user" onBack={null} />
        ),
        []
      )}

      {useMemo(
        () => (
          <HeaderArea
            searchPlaceHolder="Search user by name"
            newPath="/admin/users/new"
            selectedIds={selectedIds}
            onDelete={handleDeleteUser}
            onSearch={(data) => setQuery(data)}
          />
        ),
        [handleDeleteUser, selectedIds]
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
                          history.push(`/admin/users/${item._id}/edit`)
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

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Table, Button, Tag, notification } from "antd";
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
  },
  {
    title: "Course",
    dataIndex: "course",
    key: "course",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
  },
  {
    title: "Note",
    dataIndex: "note",
    key: "note",
    width: "40%",
  },
];

const ListPage = () => {
  const { get, post, loading, response = { data: [], total: 0 } } = useRequest(
    {}
  );

  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const pageQuery = `limit=${10 * page}&skip=${10 * page - 10}`;
    get(`/requests?${pageQuery}`);
  }, [get, page]);

  const handleProcessRequest = useCallback(
    async (type) => {
      await post("/process_requests", { selectedIds, type });
      notification.success({
        message: `${
          type === "approve" ? "Approve" : "Reject"
        } request successfully`,
        placement: "topRight",
      });
      setSelectedIds([]);
      setPage(1);
    },
    [post, selectedIds]
  );

  const handleDeleteRequest = useCallback(async () => {
    await post("/remove_requests", { selectedIds });
    notification.success({
      message: "Delete request successfully",
      placement: "topRight",
    });
    setSelectedIds([]);
    setPage(1);
  }, [post, selectedIds]);

  return (
    <Wrapper>
      {useMemo(
        () => (
          <PageHeader title="List request" onBack={null} />
        ),
        []
      )}

      {useMemo(
        () => (
          <HeaderArea
            selectedIds={selectedIds}
            onDelete={null}
            searchPlaceHolder="Search request by user name or course name"
            customButtonArea={
              <div className="button-area">
                <Button
                  icon={<CheckOutlined style={{ color: "#52c41a" }} />}
                  disabled={!selectedIds.length}
                  type="ghost"
                  style={{
                    backgroundColor: "#f6ffed",
                    border: "1px solid #b7eb8f",
                  }}
                  onClick={() => handleProcessRequest("approve")}
                >
                  Approve
                </Button>

                <Button
                  icon={<CloseOutlined style={{ color: "#ff4d4f" }} />}
                  disabled={!selectedIds.length}
                  onClick={() => handleProcessRequest("reject")}
                  type="ghost"
                  style={{
                    backgroundColor: "#fff2f0",
                    border: "1px solid #ffccc7",
                  }}
                >
                  Reject
                </Button>

                <DeleteButton
                  disabled={!selectedIds.length}
                  onClick={handleDeleteRequest}
                />
              </div>
            }
          />
        ),
        [handleDeleteRequest, handleProcessRequest, selectedIds]
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
                    user: item.user && item.user.username,
                    course: item.course && item.course.name,
                    note: <p className="note-column">{item.note}</p>,
                    status:
                      item.status === "waiting" ? (
                        <Tag color="gold">{item.status}</Tag>
                      ) : item.status === "approved" ? (
                        <Tag color="green">{item.status}</Tag>
                      ) : (
                        <Tag color="red">{item.status}</Tag>
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

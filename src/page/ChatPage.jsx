import { Col, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import MessageBox from "../component/MessageBox";
import Input from "../component/Input";
import Button from "../component/Button";
import PlusButton from "../component/PlusBoutton";
import { toast } from "react-toastify";
import { supabase } from "../config/supabase";
import { Content } from "antd/es/layout/layout";
import dayjs from "dayjs";
import { MdDelete } from "react-icons/md";
// import { supabase } from "../config/supabase";

function ChatPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [roomValue, setRoomValue] = useState("");
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatValue, setChatValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [filterRoom, setFilterRoom] = useState([]);

  const fetchRoom = async () => {
    const { data } = await supabase.from("rooms").select("*");
    setRooms(data);
    setCurrentRoom(data[0]);
    setFilterRoom(data);
  };
  const fetchMessages = async () => {
    const { data } = await supabase
      .from("messages")
      .select("id, content, created_at, user:users(id, username)")
      .eq("room_id", currentRoom?.id)
      .order("created_at", { ascending: true });
    console.log("room:", currentRoom.name);
    console.log("messages", data);
    setMessages(data);
  };

  useEffect(() => {
    fetchRoom();
  }, []);

  useEffect(() => {
    fetchMessages();

    const channel = supabase
      .channel("realtime-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${currentRoom?.id}`,
        },
        async (payload) => {
          const { data: userData } = await supabase
            .from("users")
            .select("id, username")
            .eq("id", payload.new.user_id)
            .single();

          setMessages((prev) => [
            ...prev,
            { ...payload.new, user: userData || null },
          ]);
        }
      )
      .subscribe((status) => console.log("channel status: ", status));
    // cleanup useEffect
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRoom]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setSearchDebounce(searchValue);
    }, 1000);
    console.log("Search Debounce: ", searchDebounce);

    //cleanup
    return () => clearTimeout(debounce);
  }, [searchValue]);

  useEffect(() => {
    handleSearch();
  }, [searchDebounce]);

  const handleCreateRoom = async () => {
    try {
      const { error, data } = await supabase
        .from("rooms")
        .insert([{ name: roomValue }])
        .select();
      if (!roomValue.trim()) {
        toast.error("Tên phòng không được để trống");
        return;
      }
      if (error?.code === "23505") {
        toast.error("Tên phòng đã tồn tại, vui lòng chọn tên khác");
        return;
      }

      if (error) {
        toast.error("Không thể tạo");
      }
      if (data) {
        toast.success("Tạo thành công");
        setRooms((prev) => [...prev, ...data]);
        fetchRoom();
      }
      setIsOpen(false);
      setRoomValue("");
    } catch (error) {
      toast.error("không thể tạo");
    }
  };
  const handleSendMessage = async () => {
    if (!chatValue.trim()) return;
    const value = chatValue.trim();
    const { data } = await supabase.from("messages").insert([
      {
        room_id: currentRoom.id,
        user_id: localStorage.getItem("id"),
        content: value,
      },
    ]);

    setChatValue("");
  };
  const handleSearch = () => {
    const filterData = rooms.filter((room) =>
      room.name
        .toLowerCase()
        .trim()
        .includes(searchDebounce.trim().toLowerCase())
    );
    console.log("filter: ", filterData);
    setFilterRoom(filterData);
  };
  const handleDelete = async (id) => {
    const { error, data } = await supabase
      .from("rooms")
      .delete()
      .eq("id", id)
      .select();
    if (error) {
      toast.error("Không thể xoá!!!");
    }
    if (data) {
      toast.success("Delete thành công");
      fetchRoom();
    }
  };

  return (
    <section className="w-full min-h-screen ">
      <Row className="w-full">
        <Col span={5} className="bg-[var(--first-color)] h-screen px-3 py-5]">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Tiềm kiếm phòng..."
            />
            <PlusButton onClick={() => setIsOpen(true)} />
            <Modal
              open={isOpen}
              onCancel={() => setIsOpen(false)}
              footer={
                <>
                  <Button onClick={handleCreateRoom}>Tạo</Button>
                </>
              }
            >
              <div className="mt-6">
                <Input
                  value={roomValue}
                  onChange={(e) => setRoomValue(e.target.value)}
                  placeholder="Nhập tên phòng"
                />
              </div>
            </Modal>
          </div>
          <div className="flex-1">
            {/* {chứa cái room} */}
            {filterRoom?.map((room) => (
              <div
                onClick={() => setCurrentRoom(room)}
                key={room.id}
                className={`text-black px-4 py-3 rounded-lg cursor-pointer ${
                  room.id == currentRoom.id
                    ? "bg-[var(--primary-color)]"
                    : "bg-[var(--natural-color)]"
                } bg-[var(--natural-color)] hover:bg-[var(--secondery-color)] hover:scale-[1.02] shadow-[0_4px_8px_rgba(255,255,255,0.05)] hover:shadow-[0_6px_12px_rgba(255,255,255,0.15)] transition-all duration-300 ease-in-out mb-3 hover:opacity-[0.8]`}
              >
                <div className="flex items-center justify-between">
                  <span>{room.name}</span>
                  <MdDelete
                    size={30}
                    onClick={() => handleDelete(room?.id)}
                    className="hover:text-red-700"
                  />
                </div>
              </div>
            ))}
          </div>
        </Col>
        <Col span={19} className="h-screen bg-[var(--secondery-color)]">
          <div className="w-full h-5/6 bg-[var(--natural-color)] p-5 overflow-auto">
            {messages?.map((message) => (
              <MessageBox
                key={message.id}
                message={message.content}
                name={message?.user?.username}
                time={dayjs(message.created_at).format(
                  "dddd, MMMM D, YYYY h:mm A"
                )}
                sentByCurrentUser={
                  message?.user?.id == localStorage.getItem("id")
                }
              />
            ))}
          </div>
          <div className="h-1/6 w-full flex justify-center items-center">
            <Input
              className="w-2xl "
              value={chatValue}
              onChange={(e) => setChatValue(e.target.value)}
            />
            <Button
              className="w-[200px]"
              color="default"
              variant="solid"
              onClick={handleSendMessage}
            >
              Xác nhận
            </Button>
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default ChatPage;

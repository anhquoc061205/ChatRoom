import { Col, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import MessageBox from "../component/MessageBox";
import Input from "../component/Input";
import Button from "../component/Button";
import PlusButton from "../component/PlusBoutton";
import { toast } from "react-toastify";
import { supabase } from "../config/supabase";
// import { supabase } from "../config/supabase";

function ChatPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [roomValue, setRoomValue] = useState("");
  const [rooms, setRooms] = useState([]);

  const fetchRoom = async () => {
    const { data } = await supabase.from("rooms").select("*");
    setRooms(data);
  };
  useEffect(() => {
    fetchRoom();
  }, []);

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

  return (
    <section className="w-full min-h-screen ">
      <Row className="w-full">
        <Col span={5} className="bg-[var(--default-color) h-screen px-3 py-5]">
          <div className="flex items-center justify-center gap-3 mb-10">
            <Input placeholder="Tiềm kiếm phòng..." />
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
            {rooms?.map((room) => (
              <div
                key={room.id}
                className="text-black px-4 py-3 rounded-lg cursor-pointer bg-[var(--natural-color)] hover:bg-[var(--secondery-color)] hover:scale-[1.02] shadow-[0_4px_8px_rgba(255,255,255,0.05)] hover:shadow-[0_6px_12px_rgba(255,255,255,0.15)] transition-all duration-300 ease-in-out mb-3 hover:opacity-[0.8]"
              >
                {room.name}
              </div>
            ))}
          </div>
        </Col>
        <Col span={19} className="h-screen bg-[var(--secondery-color)]">
          <div className="w-full h-5/6 bg-[var(--natural-color)] p-5 overflow-auto">
            <MessageBox
              message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus temporibus assumenda velit officia eum aperiam facere ab, eveniet, aspernatur fugit reiciendis nam esse nemo, odit repudiandae suscipit officiis quas dicta."
              name="Quốc"
              time="7:30"
              sentByCurrentUser
            />
            <MessageBox
              message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus temporibus assumenda velit officia eum aperiam facere ab, eveniet, aspernatur fugit reiciendis nam esse nemo, odit repudiandae suscipit officiis quas dicta."
              name="Quốc"
              time="7:30"
            />
            <MessageBox
              message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus temporibus assumenda velit officia eum aperiam facere ab, eveniet, aspernatur fugit reiciendis nam esse nemo, odit repudiandae suscipit officiis quas dicta."
              name="Quốc"
              time="7:30"
              sentByCurrentUser
            />
            <MessageBox
              message="Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minus temporibus assumenda velit officia eum aperiam facere ab, eveniet, aspernatur fugit reiciendis nam esse nemo, odit repudiandae suscipit officiis quas dicta."
              name="Quốc"
              time="7:30"
            />
          </div>
          <div className="h-1/6 w-full flex justify-center items-center">
            <Input className="w-2xl " />{" "}
            <Button className="w-[200px]" color="default" variant="solid">
              Xác nhận
            </Button>
          </div>
        </Col>
      </Row>
    </section>
  );
}

export default ChatPage;

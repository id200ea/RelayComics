require 'paths'
require 'torch'
require 'xlua'
require 'nn'
require 'nnx'
require 'nngraph'
require 'image'
require 'hdf5'
require 'sys'
require 'cunn'
require 'cutorch'
require 'cudnn'

paths.dofile('util/img.lua')
paths.dofile('util/eval.lua')
paths.dofile('util/pyTools.lua')

model = torch.load('../models/hgreg-3d.t7')
print('model loaded')


function posedetect()
	
	local J = 16
	local inputRes = 256
	local outputRes = 64
	
	local img_path = "../../image_transmissions/ref/pose_input.png"
	local img = image.load(img_path):narrow(1, 1, 3)
	local h, w = img:size(2), img:size(3)
	local c = torch.Tensor({w / 2, h / 2})
	local size = math.max(h, w)
	local inp = crop(img, c, 1 * size / 200.0, 0, inputRes)

	
	local output = model:forward(inp:view(1, 3, inputRes, inputRes):cuda())
	local tmpOutput = output[#output - 1]
	local p = getPreds(tmpOutput)
	local Reg = output[#output]
	local z = (Reg + 1) * outputRes / 2
	local pred = torch.zeros(J, 3)

	for j = 1, J do 
		local hm = tmpOutput[1][j]
		local pX, pY = p[1][j][1], p[1][j][2]
		if pX > 1 and pX < outputRes and pY > 1 and pY < outputRes then
		    local diff = torch.FloatTensor({hm[pY][pX+1]-hm[pY][pX-1], hm[pY+1][pX]-hm[pY-1][pX]})
		    p[1][j]:add(diff:sign():mul(.25))
		end
	end
	p:add(0.5)

	for j = 1, J do 
		pred[j][1], pred[j][2], pred[j][3] = p[1][j][1], p[1][j][2], z[1][j]
	end

	file = io.open("../../image_transmissions/ref/3d_pose.txt","w+")
	if file then
		for i=1,16 do
		    for j=1,3 do
				file:write(-pred[i][j])
				
				if(j ~= 3) then
					file:write(',')
				end
			end
			if(i~=16) then
				file:write(',')
			end
		end
	end
	file:close()
	print("finished")
end


-- load namespace
local socket = require("socket")
-- create a TCP socket and bind it to the local host, at any port
local server = assert(socket.bind("127.0.0.1", 50006))
-- find out which port the OS chose for us
local ip, port = server:getsockname()
-- print a message informing what's up
print("Please connect to localhost on port " .. port)
print (ip)
-- loop forever waiting for clients
while 1 do
  -- wait for a connection from any client
  local client = server:accept()
  print("connected")
  -- posedetect()
  posedetect()
  print(client:receive('*l'))
  print("received")
  client:send("done")
  client:close()
end



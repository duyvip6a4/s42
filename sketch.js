const R=50; //bán kính đường tròn ngoại tiếp
let Table = new Array(5); //tọa độ của bảng lục giác
let Num = new Array(5); //số trong mỗi lục giác
let Length = [5,4,5,4,5]; //số lục giác trên mỗi cột
let const_=R*Math.sqrt(3)/2; //đường cao của một tam giác


//các hình lục giác cho trước
const Init=[[90,505],[220,505],[350,505],[480,505],[610,505]]; //ban đầu
let Res=[[90,505],[220,505],[350,505],[480,505],[610,505]]; //hiện tại
let Block=new Array(5); //chữ trên các hình lục giác đó

//các trạng thái
let StartTime=0,NowTime=0,Score=0,Choose=-1,Lock=false,notStart;

//các stack để thực hiện việc undo
var Num_Stack, Block_Stack, Score_Stack;

function setup() 
{
	createCanvas(700, 600);
	frameRate(60);
	//khởi tạo tọa độ mỗi hình lục giác
	for (let i=0,x=width/2-3*R; i<5; ++i, x+=1.5*R)
	{
		Table[i] = new Array(Length[i]);
		for (let j=0,y=10+((i&1)+1)*const_; j<Length[i]; ++j, y+=2*const_)
			Table[i][j]=[x,y];
	}
	//giới thiệu luật chơi
	Intro();
}

function draw()
{
	//tính thời gian
	NowTime+=1;
	TimePassed=ceil((NowTime-StartTime)/60);
	
	if (notStart===false)
	{
		if (TimePassed == 120)
			End_game();
		else
			Play_game();
	}
}

function Play_game()
{
	background(225);
	push();
	
		textSize(40);
		textAlign(CENTER,TOP);
		
		//thời gian
		text("Time",650,20);
		text(TimePassed+"s",650,80);
		
		//số điểm
		text("Score",50,20);
		text(Score,50,80);
		
		//nút "luật chơi" và "undo"
		
		textAlign(CENTER,CENTER);
		fill("black");
		rect(72,550,200,50); 
		rect(420,550,200,50);
		fill("white");
		textSize(35);
		text("Undo",175,575,700);
		text("Luật chơi",0,575,350);
	
	pop();
	
	//Vẽ bảng và các lục giác để chọn
	for (let i=0; i<5; ++i)
	for (let j=0; j<Length[i]; ++j)
			Hexagon(Table[i][j][0],Table[i][j][1],Num[i][j]);
	for (let i=0; i<5; ++i)
		Hexagon(Res[i][0],Res[i][1],Block[i]);
	
	//Nếu như đang chọn lục giác đó, vẽ lục giác và bóng của nó
	if (Choose>=0 && Lock)
	{
		Hexagon(Res[Choose][0]+2,Res[Choose][1]+2,"shade_");
		Hexagon(Res[Choose][0],Res[Choose][1],Block[Choose]);
	}
}

function Intro()
{
	notStart=true;
	background("#1EF5EF");
	push();
	
		//Tiêu đề
		textSize(45);
		textAlign(CENTER, TOP);
		text("Hexagon",0,40,700);
		
		//Luật chơi
		textSize(24);
		textAlign(LEFT, TOP);
		text("Cho một bảng các lục giác rỗng. Với mỗi nước đi, hãy thay thế một lục giác rỗng bằng 1 trong 5 lục giác cho trước.\n\nHai lục giác kề nhau trên bảng sẽ biến mất nếu chúng có kề nhau ở cạnh của hai tam giác có số giống nhau. (như hình bên) \n\nSau mỗi lượt đi, số điểm của bạn sẽ được cộng với bình phương số lục giác biến mất trong lượt đó.\n\nThời gian giới hạn là 120s (tuy nhiên nếu bạn đã bị hết nước đi thì sẽ kết thúc luôn). Bạn có thế đạt số điểm trên 200 không?",20,100,580);
		
		//Ví dụ về lục giác biến mất
		Hexagon(640,200,"123456");
		Hexagon(640,200+2*const_,"461234");
		
		//Nút bắt đầu
		
		fill("black");
		rect(250,550,200,50);
		textAlign(CENTER,CENTER);
		fill("white");
		textSize(35);
		text("Bắt đầu",0,575,700);
	
	pop();
}

function End_game()
{
	notStart=true;
	background("#1EF5EF");
	
	push();
		//Tiêu đề
		textSize(45);
		textAlign(CENTER, TOP);
		text("Kết thúc trò chơi!",0,40,700);
		
		//Báo điểm
		text("Bạn đã được:",20,150,660);
		text(Score,0,250,700);
		
		//Nút chơi lại
		fill("black");
		rect(250,550,200,50);
		textAlign(CENTER,CENTER);
		fill("white");
		textSize(35);
		text("Chơi lại",0,575,700);
		
	pop();
}

function Set_table()
{
	//khởi tạo lại 2 mảng undo
	Num_Stack = []; Block_Stack = []; Score_Stack = [];
	//khởi tạo thời gian, điểm và trạng thái Start
	StartTime=NowTime;
	notStart=false;
	Score=0;
	
	//khởi tạo mảng Num và Block
	for (let i=0; i<5; ++i)
	{
		Num[i] = new Array(Length[i]);
		for (let j=0; j<Length[i]; ++j)
			Num[i][j]="------";
		Block[i]="";
		for (let k=0; k<6; ++k)
			Block[i]+=str(round(random(0.5,6.5))); //1->6
	}
	Ran_dom(4);
	
	//Tạo trạng thái khởi đầu của Undo
	Num_Stack.push(JSON.parse(JSON.stringify(Num)));
	Block_Stack.push(JSON.parse(JSON.stringify(Block)));
	Score_Stack.push(Score);
}

function mouseDragged() //di chuyển hình lục giác được chọn
{
	//nếu chưa bắt đầu chơi
	if (notStart) return;
	
	//nếu như chưa khóa chuột
	if (Lock===false)
	{
		//tìm hình lục giác được click
		Choose=hexa_clicked();
		if (Choose===-1) return;
		Lock=true;
	}
	
	//thay đổi tọa độ tâm dựa trên di chuyển
	Res[Choose][0]+=mouseX-pmouseX; 
	Res[Choose][1]+=mouseY-pmouseY;
}

//kiểm tra đã click vào đa giác nào
function hexa_clicked()
{
	for (let i=0; i<5; ++i)
		if (inside(Res[i][0],Res[i][1],pmouseX,pmouseY))
			return i;
	return -1;
}

function mouseReleased()
{
	//nếu chưa chơi, check nút Bắt đầu (hoặc Chơi lại)
	if (notStart) 
	{
		if (mouseX>=250 && mouseX<=450 && mouseY>=550 && mouseY<=600)	
			Set_table();
		return;
	}
	
	//nếu đã chơi, check nút Luật chơi & Undo
	if (mouseX>=72 && mouseX<=272 && mouseY>=550)
	{
		Intro();
		return;
	}
	if (mouseX>=420 && mouseX<=620 && mouseY>=550)
	{
		Undo();
		return;
	}
	//nếu khác, check xem đã hình lục giác nào bị chọn chưa
	Lock=false;
	if (Choose===-1 || notStart) return;
	
	//nếu đã có hình lục giác chọn, gán hình lục giác với Table
	
	let coor=hexa_release();
	Res[Choose][0]=Init[Choose][0];
	Res[Choose][1]=Init[Choose][1];
	if (coor === -1) return;
	Num[coor[0]][coor[1]]=Block[Choose];
	//khởi tạo hình lục giác mới
	Ran_dom(Choose);
	//Check nếu có hình lục giác nào biến mất hay không
	check_and_delete();
	
	//Push các trạng thái vào các mảng Undo
	Num_Stack.push(JSON.parse(JSON.stringify(Num)));
	Block_Stack.push(JSON.parse(JSON.stringify(Block)));
	Score_Stack.push(Score);
}

//kiểm tra đã thả chuột vào đa giác nào
function hexa_release()
{
	for (let i=0; i<5; ++i)
	for (let j=0; j<Length[i]; ++j)
		if	((Res[Choose][0]-Table[i][j][0])*(Res[Choose][0]-Table[i][j][0])+(Res[Choose][1]-Table[i][j][1])*(Res[Choose][1]-Table[i][j][1])<=800 && Num[i][j]==="------")
			return [i,j];
	return -1;
}

//các mảng để kiểm tra kề cạnh
let coor_side=[[0,-1],[+1,0],[+1,+1],[0,+1],[-1,+1],[-1,0]]; //hàng cột
let side_=[3,4,5,0,1,2]; //kí tự kề tương ứng tọa độ chênh lệnh

function check_and_delete()
{ 
	//check điểm và đánh dấu các đa giác biến mất
	let BOOL=new Array(5), ScoreCount=0, Count=0;
	//Count là biến đếm số đa giác trống. Nếu Count=0 -> Endgame
	for (let i=0; i<5; ++i)
	{
		BOOL[i]=new Array(5);
		for (let j=0; j<5; ++j)
			BOOL[i][j]=false;
	}
	
	//kiểm tra x=1,x=3
	let px,py;
	for (let x=1; x<=3; x+=2)
	for (let y=0; y<=3; ++y)
	for (let k=1; k<=5; ++k)
	{
		if (y===3 && k===3) continue;
		px=x+coor_side[k][0];
		py=y+coor_side[k][1];
		if (Num[x][y][k] != "-" && Num[x][y][k] === Num[px][py][side_[k]])
		{
			BOOL[x][y]=true;
			BOOL[px][py]=true;
		}
	}
	
	//kiểm tra x=0,2,4
	for (let x=0; x<6; x+=2)
	for (let y=0; y<=3; ++y)
		if (Num[x][y][3] === Num[x][y+1][0]) 
		{
			BOOL[x][y]=true;
			BOOL[x][y+1]=true;
		}
		
	//kiểm tra ScoreCount và Count
	for (let i=0; i<5; ++i)
	for (let j=0; j<Length[i]; ++j)
		if (BOOL[i][j] && Num[i][j]!=="------")
		{
				Num[i][j]="------";
				++ScoreCount;
		}
		else 
			Count += (Num[i][j]==="------");
	//cộng Score và check Count
	Score+=ScoreCount*ScoreCount;
	if (Count == 0) End_game();
}

//tạo Random cho Block[id] sao cho nó luôn trùng với 1 trong các Block[] còn lại
function Ran_dom(id)
{
	Block[id]="";
	let index;
	do
		index=round(random(-0.5,4.5)); //0->5
	while (index==id);
	
	let thesame=round(random(-0.5,4.5));
	
	for (let i=0; i<6; ++i)
	{
		if (i === thesame)
			Block[id]+=Block[index][side_[thesame]];
		else 
			Block[id]+=round(random(0.5,6.5));
	}
}

function Undo()
{
	if (Num_Stack.length <= 1) return;
	Num_Stack.pop();
	Block_Stack.pop();
	Score_Stack.pop();
	let L=Num_Stack.length-1;
	Num=Num_Stack[L];
	Block=Block_Stack[L];
	Score=Score_Stack[L];
  
}

//kiểm tra điểm (pointx,pointy) có nằm trong lục giác tâm (x,y)
function inside(pointx,pointy,x,y)
{
	let Y=pointy-y, X=pointx-x; //chuyển về tâm (0,0) cho dễ tính
	let l2 = Y * Y + X * X;
	if (l2 > R*R) return false;
	if (l2 < R*0.75) return true;
	let pY = Y * 2 / Math.sqrt(3); // 2/sqrt(3)
	if (pY > R || pY < -R) return false;
	let pX = 0.5 * pY + X;
	if (pX > R || pX < -R) return false;
	if (pY - pX > R || pY - pX < -R) return false;
	return true;
}

//các tọa độ để vẽ số trên tam giác
let Numxy=[[0,-R/Math.sqrt(3)],[R/2,-R*Math.sqrt(3)/6],[R/2, R*Math.sqrt(3)/6],[0,R/Math.sqrt(3)],[-R/2,R*Math.sqrt(3)/6],[-R/2, -R*Math.sqrt(3)/6]];

function Hexagon(x,y,str)
{
	push();
		translate(x,y);
		strokeWeight(3);
		//nếu như str rỗng hoặc là shade, không vẽ line
		//nếu như str đã có số, chọn nền xanh
		let drawNum;
		if (str!=="------")
		{
			drawNum=true;
			fill("#89D8F1");
		}
		else 
		{
			drawNum=false;
			if (str==="shade_")
			{
				fill("#78453A");
				noStroke();
			}
			else 
				fill("white");
		}
			
		//vẽ hình lục giác
		beginShape();
		vertex(-R/2, -const_);
		vertex(R/2, -const_);
		vertex(R, 0);
		vertex(R/2, const_);
		vertex(-R/2, const_);
		vertex(-R,0);
		endShape(CLOSE);
		
		//vẽ số
		if (str!=="------" && str[0]!=="s")
		{
			strokeWeight(1);
			line(-R/2, -const_, R/2, const_);
			line(R/2, -const_, -R/2, const_);
			line(R, 0, -R, 0);
			fill("black");
			textAlign(CENTER,CENTER);
			textSize(20);
			for (let i=0; i<6; ++i)
				text(str[i],Numxy[i][0],Numxy[i][1]);
		}
	pop();
}

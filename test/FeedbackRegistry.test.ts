import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";

import { Reverter } from "./helpers/reverter";
import { getPoseidons } from "./helpers/poseidons";
import { initCertIntegrator } from "./helpers/utils";

describe("FeedbackRegistry", async () => {
  const reverter = new Reverter();

  let feedbackRegistry: Contract;
  let certIntegrator: Contract;

  let COURSE = "0x63223538169D7228b37C9182eD6d2b9B2CfD8F26";

  let IPFS: string;
  let KEYS: string[];
  let VALUES: string[];
  let PROOFS: string[][];

  let I: BigInt;
  let C: BigInt[];
  let R: BigInt[];
  let PUBLIC_KEYS_X: BigInt[];
  let PUBLIC_KEYS_Y: BigInt[];

  before(async () => {
    IPFS = "QmcafQDfq4LGzQ6CimzLVBt7rqEAFSwE4ya8uZt9zUSZJr";
    KEYS = [
      "0x4e04f9e04f79fa38ce851d00a796711ba49d7452000000000000000000000000",
      "0x65419d8f9be1d47adf04c157dcf3e3405e50d8f1000000000000000000000000",
      "0x04da72da5d3b0208c2cb20d53ce8a16c49436150000000000000000000000000",
      "0x2cbff6fb6fe31586e9a2952b95daf86395a4ab53000000000000000000000000",
      "0x00593216e5b241ba85b9aa296d98b14a390a06c9000000000000000000000000",
    ];

    VALUES = [
      "0x0300000000000000000000000000000000000000000000000000000000000000",
      "0x0100000000000000000000000000000000000000000000000000000000000000",
      "0x0200000000000000000000000000000000000000000000000000000000000000",
      "0x0100000000000000000000000000000000000000000000000000000000000000",
      "0x0100000000000000000000000000000000000000000000000000000000000000",
    ];

    PROOFS = [
      [
        "0xd6d8b50f7b17156031b2c8eb2a9e91e808f3e096e2a7a445e4d98fceed675c01",
        "0xfba874f67a121eeea4d89cca02e55073f0f6caa78181aac177db3c0722c24f28",
      ],
      ["0x45fd4c32fb406759ff169fccaf8e041d73287f3e4dc156b6ab7e1a45cc6a051c"],
      [
        "0xd6d8b50f7b17156031b2c8eb2a9e91e808f3e096e2a7a445e4d98fceed675c01",
        "0xc1c7b47d980404e55fcadba46290561e362e89cbe3922de0ee69905f34484517",
        "0x0d9f9a5dbfce2728584c827f5140b28839d3666e71babbe7a31c0400db00ff0b",
        "0xf0bc35a3399bf316321939d9ea1d5ec8758df74bdf13c211a546ac0d20c9d510",
      ],
      [
        "0xd6d8b50f7b17156031b2c8eb2a9e91e808f3e096e2a7a445e4d98fceed675c01",
        "0xc1c7b47d980404e55fcadba46290561e362e89cbe3922de0ee69905f34484517",
        "0x0d9f9a5dbfce2728584c827f5140b28839d3666e71babbe7a31c0400db00ff0b",
        "0x4b0a5455ea47b24699ebfe1a26ed18d8a51ed0a03bdc44acf66cf48166152a2e",
      ],
      [
        "0xd6d8b50f7b17156031b2c8eb2a9e91e808f3e096e2a7a445e4d98fceed675c01",
        "0xc1c7b47d980404e55fcadba46290561e362e89cbe3922de0ee69905f34484517",
        "0x4badad9b8287758e9a83d68fb959b13454fd1c8cdf61727b74b0ef6ae5be9f20",
      ],
    ];

    C = [
      BigInt("70041801939983713545541323538650867611888908572372755867640542626006700327007"),
      BigInt("11383195236235059450968274357691085014684782031145982541396720988477490355059"),
      BigInt("51457338063847717974933298524926316666611040906549651277498439048797732727515"),
      BigInt("83520285365944823477249362188943334196252479687517416825605418842699868933856"),
      BigInt("4440865536153965334656762989295988603297907172732379424317783759012410342008"),
    ];
    I = BigInt("50471588177842483870949591504891431469788067843245220753429247714802432717931");
    R = [
      BigInt("34681769164153180207730108951907248945808824653538588288572152602466724238167"),
      BigInt("38421218312886342217363291339022477464498983787463718180231007937762144399467"),
      BigInt("55694777476098176687069655949015141665418945773107005677892088091197214072682"),
      BigInt("77005503372202429945955839956465406013552055414574695047693968274216394517182"),
      BigInt("2895594570500927798135432795361534101459713373207995170134619553792849695557"),
    ];

    PUBLIC_KEYS_X = [
      BigInt("21544180725283665080737435029403945626738292305451098752032497668875188941561"),
      BigInt("15264671438695105554814157736171101693808132776909943100114660041813940424917"),
      BigInt("63078138120762156328738222228180148525554661293694095968990272456102849232459"),
      BigInt("110876696510807313718716669564696607303253365879927370640173820875503868896830"),
      BigInt("75160285585510138550546692233670343500621109774094027756314740373042193659309"),
    ];

    PUBLIC_KEYS_Y = [
      BigInt("29607869487799476451128679839843791240101423214162884824978515269761488121624"),
      BigInt("109760428980812280723640160076609939028183677671160852284735976210464342282729"),
      BigInt("96177297683348046674660984212655186653942447147719072583799479170909174380078"),
      BigInt("44503777459039890091037753626975999547975490216181475985249318303451719660782"),
      BigInt("78299027417075857530472507339741312673696906924523594633968044219747971426857"),
    ];

    certIntegrator = await initCertIntegrator(COURSE, [
      "0x0000000000000000000000000000000000000000000000000000000000000001",
      "0x0000000000000000000000000000000000000000000000000000000000000002",
      "0x2018445dcff761ed409e5595ab55308a99828d7f803240a005d8bbb4d1c69924",
      "0xfff7d65808452f96d578a2c159315b487a4af2eda920ad9b2e572ff47309c714",
      "0x1236c7c84fbced418368c03b6d3ed20d40d10a24e2f140dab56a8bbf82aea80d",
    ]);

    let { poseidonHasher2, poseidonHasher3 } = await getPoseidons();

    const feedbackRegistryContract = await ethers.getContractFactory("FeedbackRegistry", {
      libraries: {
        PoseidonUnit2L: poseidonHasher2.address,
        PoseidonUnit3L: poseidonHasher3.address,
      },
    });

    feedbackRegistry = await feedbackRegistryContract.deploy(certIntegrator.address);

    await reverter.snapshot();
  });

  afterEach("revert", reverter.revert);

  describe("#addFeedback", () => {
    it("should add feedback correctly", async () => {
      await feedbackRegistry.addFeedback(COURSE, I, C, R, PUBLIC_KEYS_X, PUBLIC_KEYS_Y, PROOFS, KEYS, VALUES, IPFS);

      expect(await feedbackRegistry.contractFeedbacks(COURSE, 0)).to.equal(IPFS);
    });

    it("should add feedbacks correctly", async () => {
      await feedbackRegistry.addFeedback(COURSE, I, C, R, PUBLIC_KEYS_X, PUBLIC_KEYS_Y, PROOFS, KEYS, VALUES, IPFS);

      let c = [
        BigInt("95593772452988548797584702700614976759598547735480560019061601720733036070655"),
        BigInt("72367725849970107279473806495086388380329608816784746903363186523164005219237"),
        BigInt("101005801860091418701873602222447382842542125315080612801049682202091736794323"),
        BigInt("50464443347419473763501884772307991275858433897976851422965049907762115022564"),
        BigInt("53873725491103934607321454841672555093079369636606788673998319068216049119486"),
      ];
      let i = BigInt("50471588177842483870949591504891431469788067843245220753429247714802432717931");
      let r = [
        BigInt("18760959131497910176590618885895348014835071232767487618151415944951863715709"),
        BigInt("93641633942938017875149022665748231861393508101289408417552048576145600174241"),
        BigInt("20664874913975052532425223260394811948401613784525294983364407210210210773032"),
        BigInt("14061590544799875826928616881348970427958631545351897379047521186613752200628"),
        BigInt("51727424129169314651399640234993932014344871560681574025566420767994377729160"),
      ];

      let ipfs = "QmPz6TMRCtb5XBumveF1WxAc4NWHDMancxcA5uNa4ksDzH";

      await feedbackRegistry.addFeedback(COURSE, i, c, r, PUBLIC_KEYS_X, PUBLIC_KEYS_Y, PROOFS, KEYS, VALUES, ipfs);

      expect(await feedbackRegistry.contractFeedbacks(COURSE, 0)).to.equal(IPFS);
      expect(await feedbackRegistry.contractFeedbacks(COURSE, 1)).to.equal(ipfs);
    });

    it("should revert Merkle Tree verification", async () => {
      let proof = [
        [
          "0x0000000000000000000000000000000000000000000000000000000000000000",
          "0x9f341c74c45f6f3a785981307c1d07a060b936fe5f4d022c0f9b64546f590818",
        ],
      ];

      await expect(
        feedbackRegistry.addFeedback(COURSE, I, C, R, PUBLIC_KEYS_X, PUBLIC_KEYS_Y, proof, KEYS, VALUES, IPFS)
      ).to.be.revertedWith("FeedbackRegistry: wrong Merkle Tree verification");
    });

    it("should revert empty Merkle Tree verification", async () => {
      await expect(
        feedbackRegistry.addFeedback(COURSE, I, C, R, PUBLIC_KEYS_X, PUBLIC_KEYS_Y, [[]], KEYS, VALUES, IPFS)
      ).to.be.revertedWith("SMTVerifier: sparse Merkle Tree proof is empty");
    });

    it("should revert wrong signature", async () => {
      let c = [
        BigInt("70041801939983713545541323538650867611888908572372755867640542626006700327005"),
        BigInt("11383195236235059450968274357691085014684782031145982541396720988477490355059"),
        BigInt("51457338063847717974933298524926316666611040906549651277498439048797732727515"),
        BigInt("83520285365944823477249362188943334196252479687517416825605418842699868933856"),
        BigInt("4440865536153965334656762989295988603297907172732379424317783759012410342008"),
      ];

      await expect(
        feedbackRegistry.addFeedback(COURSE, I, c, R, PUBLIC_KEYS_X, PUBLIC_KEYS_Y, PROOFS, KEYS, VALUES, IPFS)
      ).to.be.revertedWith("FeedbackRegistry: wrong signature");
    });
  });

  describe("#getFeedbacks", () => {
    it("should return feedback for course", async () => {
      await feedbackRegistry.addFeedback(COURSE, I, C, R, PUBLIC_KEYS_X, PUBLIC_KEYS_Y, PROOFS, KEYS, VALUES, IPFS);

      expect(await feedbackRegistry.getFeedbacks(COURSE, 0, 3)).to.deep.equal([IPFS]);
    });

    it("should return feedback for course", async () => {
      await feedbackRegistry.addFeedback(COURSE, I, C, R, PUBLIC_KEYS_X, PUBLIC_KEYS_Y, PROOFS, KEYS, VALUES, IPFS);

      expect(await feedbackRegistry.getFeedbacks(COURSE, 0, 1)).to.deep.equal([IPFS]);
    });
  });

  describe("#getAllFeedbacks", () => {
    it("should return all feedbacks with courses", async () => {
      await feedbackRegistry.addFeedback(COURSE, I, C, R, PUBLIC_KEYS_X, PUBLIC_KEYS_Y, PROOFS, KEYS, VALUES, IPFS);

      expect(await feedbackRegistry.getAllFeedbacks(0, 3)).to.deep.equal([[COURSE], [[IPFS]]]);
    });
  });
});

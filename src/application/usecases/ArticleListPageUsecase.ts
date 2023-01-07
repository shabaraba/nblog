import { PostHeadDto } from "application/modules/post/objects/dtos/PostHeadDto";
import { PostHeadService } from "application/modules/post/services/PostHeadService";
import { PostHeadType, PostHeadDxo } from "core/dxo/PostHeadDxo";

export class ArticleListPageUsecase {
  public static async getStaticProps() {
    const postHeadService = new PostHeadService();
    const postHeadDtoList: PostHeadDto[] = await postHeadService.getList();
    const postHeadEntityList: PostHeadType[] = postHeadDtoList.map(postHeadDto => PostHeadDxo.convertForPages(postHeadDto));

    return {
      props: {
        allPostsData: postHeadEntityList,
      },
      // revalidate: 1 * 60
    }
  }

}
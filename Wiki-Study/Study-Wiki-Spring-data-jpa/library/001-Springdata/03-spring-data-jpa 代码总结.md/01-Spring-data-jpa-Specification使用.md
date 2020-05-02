# Specification 的使用总结


# 零碎代码总结记录

## and where

```java
public Page<Tbatmotask> getTbatmotaskTree(Integer state, String taskname, Pageable pageable) {
        Specification<Tbatmotask> specification = new Specification<Tbatmotask>() {
            @Override
            public Predicate toPredicate(Root<Tbatmotask> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder criteriaBuilder) {
                List<Predicate> predicates = new ArrayList<>();
                if (state != null){
                    Predicate p1 = criteriaBuilder.equal(root.get("state").as(Integer.class), state);
                    predicates.add(p1);
                }
                Predicate predicatesWhere= criteriaBuilder.and(predicates.toArray(new Predicate[predicates.size()]));
                List<Predicate> predicates2 = new ArrayList<>();
                if (!StringUtils.isEmpty(taskname)){
                    Predicate p1 = criteriaBuilder.like(root.get("taskid").as(String.class), "%" + taskname + "%");
                    Predicate p2 = criteriaBuilder.like(root.get("description").as(String.class), "%" + taskname + "%");
                    predicates2.add(p1);
                    predicates2.add(p2);
                }
                Predicate predicatesPermission = criteriaBuilder.or(predicates2.toArray(new Predicate[predicates2.size()]));
                if(!StringUtils.isEmpty(taskname))
                return criteriaQuery.where(predicatesWhere,predicatesPermission).orderBy(criteriaBuilder.desc(root.get("taskid"))).getRestriction();
                else return criteriaQuery.where(predicatesWhere).orderBy(criteriaBuilder.desc(root.get("taskid"))).getRestriction();
            }
        };
        Page<Tbatmotask> pagetask=tbatmotaskDao.findAll(specification,pageable);
        //Page<Tbatmotask> pages = tbatmotaskDao.findByState(state,pageable);
        return pagetask;
    }

```
